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
let contactEndPoint = `${urlBase}/AddContact.${extension}`;

//global vars
let userID = 0;
let firstName = "";
let lastName = "";

// Open popup
createUserBtn.addEventListener('click', () => {
    createUserPopup.style.display = 'block';
});

// Close popup
closeBtn.addEventListener('click', () => {
    createUserPopup.style.display = 'none';
});

// Close popup when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === createUserPopup) {
        createUserPopup.style.display = 'none';
    }
});
 
// Handle create form submission
createUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    firstName = document.getElementById('firstName').value;
    lastName = document.getElementById('lastName').value;
    let password = document.getElementById('confirmPassword').value;
    let login = document.getElementById('newUsername').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
  
    let reqData = {
      FirstName: firstName,
      LastName: lastName,
      Login: login,
      Email: email,
      Phone: phone,
      Password: password
    };
  
    console.log("Sending Request Data:", reqData);
  
    let jsonPayload = JSON.stringify(reqData);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", createEndPoint, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        let jsonObject = JSON.parse(xhr.responseText);
        userID = jsonObject.userID;
        console.log("User created with ID:", userID);
      }
      else{
        console.error("Error: ", xhr.status, xhr.responseText);
      }
    }
    xhr.send(jsonPayload);
  
});

function loginCookie(userID){
    let minutes = 60;
    let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
    //set the cookie parameters
    document.cookie = "firstName=" + firstName + ";";
    document.cookie = "lastName=" + lastName + ";";
    document.cookie = "userID=" + userID + "; expires=" + date.toGMTString() + "; path=/";
}

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

// Handle login form submission
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let xhr = new XMLHttpRequest();
    let url = urlBase + '/Login.' + extension;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            let response = JSON.parse(xhr.responseText);
            
            if (xhr.status === 200) {
                if (response.error) {
                    alert(response.error);
                } else {
                    userID = response.userID;
                    firstName = response.firstName;
                    lastName = response.lastName;
                    loginCookie(userID);
                    alert('Login successful!');
                    // Redirect to contact page
                    window.location.href = 'contact.html'
                }
            } else {
                alert('Error logging in. Please try again.');
                console.error(xhr.statusText);
            }
        }
    };

    let jsonPayload = JSON.stringify({
        Login: username,
        Password: password
    });
    console.log("Sending Request Data:", jsonPayload);

    xhr.send(jsonPayload);
});

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
    let jsonPayload = JSON.stringify( reqData );

	// makes new request objet
    let xhr = new XMLHttpRequest();
	xhr.open("POST", contactEndPoint, true);
	// shows that JSON data is being sent through the request header
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{// 4 bc that means request is fully completed and 200 bc request was succesful
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
})

//Handle logout button functinality 
const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', () =>{
    //clear cookies
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    //redirct to login page
    window.href = 'index.html'
})