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

// Define newContactForm
const newContactForm = document.getElementById('newContactForm');

// Handle new contact form submission
newContactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // getting the input values 
    firstName = document.getElementById('firstName').value;
    lastName = document.getElementById('lastName').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    document.getElementById('addContactResult').innerHTML=""; //clears contents so it resets for next UI action

    // Add new row to table
    const tableBody = document.getElementById('contactsTableBody');
    let newRow = tableBody.insertRow(0); // Insert at the top
    newRow.innerHTML = `
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>
            <button class="primary-button">Edit</button>
            <button class="primary-button">Delete</button>
        </td>
    `;

    // making tmp object that has all those parameters
    let reqData = {
        UserID: userID,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: phone,
    };

    // changing it to JSON string
    let jsonPayload = JSON.stringify(reqData);

    // makes new request object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", contactEndPoint, true);
    // shows that JSON data is being sent through the request header
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {// 4 bc that means request is fully completed and 200 bc request was successful
            if (this.readyState == 4 && this.status == 200) 
            {
                document.getElementById("addContactResult").innerHTML = "Contact has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)// if error happens then message displayed
    {
        document.getElementById("addContactResult").innerHTML = err.message;
    }
});

// Handle add contact button click to show popup
const addContactBtn = document.getElementById('addContactBtn');
const addContactPopup = document.getElementById('addContactPopup');
const closeBtn = document.querySelector('.close-btn');

addContactBtn.addEventListener('click', () => {
    addContactPopup.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    addContactPopup.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === addContactPopup) {
        addContactPopup.style.display = 'none';
    }
});

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', () =>{
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'index.html';
});

