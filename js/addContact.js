let urlBase = 'http://your-api-url.com/api';  // Replace with your actual API URL
let extension = 'php';

function addContact() {
	// getting the input values 
    let contactFirstName = document.getElementById("contactFirstName").value;
	let contactLastName = document.getElementById("contactLastName").value;
    let contactPhone = document.getElementById("contactNum").value;
    let contactEmail = document.getElementById("contactEmail").value;
    document.getElementById('addContactResult').innerHTML=""; //clears contents so it resets for next UI action

	// making tmp object that has all those parameters
    let tmp = {firstname: contactFirstName, lastname: contactLastName,phone: contactPhone, email: contactEmail, userId: "testUser124"};

	// changing it to JSON string
    let jsonPayload = JSON.stringify( tmp );
    
	// setting up the endpoint
    let url = urlBase + '/AddContact.' + extension;

	// makes new request objet
    let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
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
}






function searchContact() {
	// gets search input valaues
	let searchInput = document.getElementById("searchInput").value;
	document.getElementById("searchResult").innerHTML="";//clear contents again
}


function updateContact() {

}
