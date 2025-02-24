const urlBase = 'http://localhost/LAMPAPI'
const extension = 'php';

// Popup functionality
const createUserBtn = document.getElementById('createUserBtn');
const createUserPopup = document.getElementById('createUserPopup');
const closeBtn = document.querySelector('.close-btn');

//defined functions for forms
const newContactForm = document.getElementById('newContactForm');
const createUserForm = document.getElementById('createUserForm');

//PHP ENDPOINTS
let createEndPoint = `${urlBase}/Create.${extension}`;
let addContactEndPoint = `${urlBase}/AddContact.${extension}`;
let searchContactEndpoint = `${urlBase}/SearchContact.${extension}`;
let deleteContactEndpoint = `${urlBase}/DeleteContact.${extension}`;
let saveContactEndpoint = `${urlBase}/EditContact.${extension}`

//global vars
let userID = 0;
let firstName = "";
let lastName = "";

// Function to read cookie
function readCookie(){
    userID = -1;
    //take the cookie for the logged in user and split the cookie parameters
    let data = document.cookie.split(";");

    //search the data for the userID by trimming it and looking for where it starts with userid=
    for(let i = 0; i < data.length; i++){
        let cookieID = data[i].trim();
        if(cookieID.startsWith("userID=")){
            //userID is now the one found in the split.
            userID = cookieID.split("=")[1];
            break;
        }
    }
}

// Read cookie to get userID
document.addEventListener("DOMContentLoaded", function(){
    readCookie();
    console.log("User ID: ", userID);
});



let isAddContactListenerAdded = false; // Flag to check if listener is added

// add a new contact
function addContact() {
    console.log("addContact function called."); // Debugging line
    const firstName = document.getElementById('newFirstName').value.trim();
    const lastName = document.getElementById('newLastName').value.trim();
    const phone = document.getElementById('newPhone').value.trim();
    const email = document.getElementById('newEmail').value.trim();

    // Log the values retrieved
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Phone:", phone);
    console.log("Email:", email);

    //debugger;

    // check input
    if (!firstName || !lastName || !phone || !email) {
        alert("Pls fill in all fields.");
        return; 
    }

    // making tmp object that has all these parameters
    let reqData = {
        UserID: userID, 
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: phone,
    };

    // changing it to JSON string
    let jsonPayload = JSON.stringify( reqData );

    // makes new request object
    let xhr = new XMLHttpRequest();
    // Set the endpoint for the request
    xhr.open("POST", addContactEndPoint, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            // Check if the request is complete and successful
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("addContactResult").innerHTML = "Contact has been added";
            }
        };
        xhr.send(jsonPayload); // Send the request with the JSON
    } catch (err) {
        // Handle any errors 
        document.getElementById("addContactResult").innerHTML = err.message;
    }

    // make a new row in the contacts table
    const tableBody = document.getElementById('contactsTableBody');
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>
            <button class="primary-button update-btn" onclick="updateContact(this)">Update</button>
            <button class="primary-button delete-btn" onclick="deleteContact(this)">Delete</button>
        </td>
    `;

    // Clear the input feilds
    document.getElementById('newFirstName').value = '';
    document.getElementById('newLastName').value = '';
    document.getElementById('newPhone').value = '';
    document.getElementById('newEmail').value = '';
}



// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // the Add Contact button
    const addContactBtn = document.getElementById('addContactBtn');
    alert("in event listener");

    if (addContactBtn) {
        console.log("Adding event listener for addContactBtn"); // Debugging line
        //addContactBtn.addEventListener('click', addContact);
    }
    const searchButton = document.getElementById('searchButton'); 

    if (searchButton) {
        //searchButton.addEventListener('click', searchContact); 
    }
});





function deleteContact(button) {
    // Get the row of the button that was clocked
    const row = button.parentElement.parentElement;
    
    const contactId = row.getAttribute('data-contact-id'); 

    // confirm that they are deleting
    const confirmDelete = confirm("Are you sure you want to delete this contact?");
    if (confirmDelete) {
        row.parentElement.removeChild(row); // Remove the row 
    }

    // Create a request object
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", deleteContactEndpoint, true); // Adjust the endpoint as needed
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("addContactResult").innerHTML = "Contact has been deleted";
                // Remove the row from the table
                row.parentElement.removeChild(row);
            }
        };
        xhr.send();
    } catch (err) {
        document.getElementById("addContactResult").innerHTML = err.message;
    }
}


function logout() {
    //resets user id and clears data
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; //clears userId cookie
    window.location.href = 'index.html';
}

function updateContact(button) {
    const row = button.parentElement.parentElement; // Get the row of the clicked button

    // Get the current values from the row
    const firstName = row.cells[0].innerText;
    const lastName = row.cells[1].innerText;
    const phone = row.cells[2].innerText;
    const email = row.cells[3].innerText;

    // Replace the row with input fields instead
    row.innerHTML = `
        <td><input type="text" value="${firstName}" id="editFirstName"></td>
        <td><input type="text" value="${lastName}" id="editLastName"></td>
        <td><input type="tel" value="${phone}" id="editPhone"></td>
        <td><input type="email" value="${email}" id="editEmail"></td>
        <td>
            <button class="primary-button" onclick="saveContact(this)">Save</button>
            <button class="primary-button" onclick="cancelEdit(this)">Cancel</button>
        </td>
    `;
}

function saveContact(button) {
    const row = button.parentElement.parentElement; // Get the row of the clicked button
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const phone = document.getElementById('editPhone').value;
    const email = document.getElementById('editEmail').value;

    // check input
    if (!firstName || !lastName || !phone || !email) {
        alert("Please fill in all fields.");
        return;
    }

    // Get the contact ID from the row (assuming you have a data attribute for the ID)
    const contactId = row.getAttribute('data-contact-id');

    // Create the contact object
    const contactData = { FirstName: firstName, LastName: lastName, Phone: phone, Email: email };

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    // Set the endpoint for the request
    xhr.open("PUT", saveContactEndpoint, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // Handle the response
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const data = JSON.parse(xhr.responseText);
                // Update the row with the new values
                row.innerHTML = `
                    <td>${data.FirstName}</td>
                    <td>${data.LastName}</td>
                    <td>${data.Phone}</td>
                    <td>${data.Email}</td>
                    <td>
                        <button class="primary-button update-btn" onclick="updateContact(this)">Update</button>
                        <button class="primary-button delete-btn" onclick="deleteContact(this)">Delete</button>
                    </td>
                `;
            } else {
                alert("Error updating contact.");
                console.error("Error:", this.statusText);
            }
        }
    };

    // Convert the contact data to JSON string and send the request
    const jsonPayload = JSON.stringify(contactData);
    xhr.send(jsonPayload);
}

function cancelEdit(button) {
    const row = button.parentElement.parentElement; // Get the row of the button clicked
    // Revert the row back to what it was originally
    const firstName = row.cells[0].querySelector('input').value;
    const lastName = row.cells[1].querySelector('input').value;
    const phone = row.cells[2].querySelector('input').value;
    const email = row.cells[3].querySelector('input').value;

    row.innerHTML = `
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>
            <button class="primary-button update-btn" onclick="updateContact(this)">Update</button>
            <button class="primary-button delete-btn" onclick="deleteContact(this)">Delete</button>
        </td>
    `;
}

function searchContact() {
    const query = document.getElementById('searchInput').value.trim(); // Get the search input value when the button is clicked
    const reqData = { search: query }; // Create the request data object

    const xhr = new XMLHttpRequest();
    xhr.open("POST", searchContactEndpoint, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    const responseData = JSON.parse(xhr.responseText);
                    if (responseData.error) {
                        displayError(responseData.error);
                    } else {
                        
                        updateContactsTable(responseData.Contacts);
                    }
                } catch (e) {
                    displayError("An error occurred while processing the response."); 
                }
            } else {
                displayError("Error: " + this.statusText); // Handle HTTP errors
            }
        }
    };

    // Send the request with the JSON payload
    xhr.send(JSON.stringify(reqData));
}

function resetSearch() {
    document.getElementById('searchInput').value = ''; 
    searchContact(); 
}



function updateContactsTable(contacts) {
    const tableBody = document.getElementById('contactsTableBody');
    tableBody.innerHTML = ''; // Clear existing rows
    alert("in updateContactsTable"+tableBody);

    if (contacts.length > 0) {
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.FirstName}</td>
                <td>${contact.LastName}</td>
                <td>${contact.Phone}</td>
                <td>${contact.Email}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4">No contacts found</td>';
        tableBody.appendChild(row);
    }

    // Add the "Add Contact" row back to the table
    const addContactRow = document.createElement('tr');
    addContactRow.innerHTML = `
        <td><input type="text" id="newFirstName" placeholder="First Name"></td>
        <td><input type="text" id="newLastName" placeholder="Last Name"></td>
        <td><input type="tel" id="newPhone" placeholder="Phone Number"></td>
        <td><input type="email" id="newEmail" placeholder="Email"></td>
        <td>
            <button class="primary-button" id="addContactBtn" onclick="addContact()">Add Contact</button>
        </td>
    `;
    tableBody.appendChild(addContactRow);
}

function displayError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerText = message;
    errorContainer.style.display = 'block';
}

function hideError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.style.display = 'none';
}











