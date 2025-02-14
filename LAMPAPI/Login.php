<?php

//reads JSON from request and returns as an array
function getRequestData(){
    return json_decode(file_get_contents('php://input'), true);
}

//sends object as a json repsonse
function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

//returns error in json format and stops execution
function returnWithError($err){
    $retValue = json_encode(["error" => $err]);
    sendResultInforAsJson($retValue);
    exit();
}

//returns a success message w/ user id in json format
function returnWithInfo($id, $username)
	{
		$retValue = '{"id":' . $id . ',"username":"' . $username . '","error":""}';
		sendResultInfoAsJson($retValue);
	}

//grab json data
$inData = getRequestData();

//extract user and password
$username = $inData["username"];
$password = $inData["password"];

//connect to db
$conn = new mysqli("localhost", "root", "testpass", "contact");
//check if connection fails
if($conn->connect_error){
    returnWithError("Couldnt Connect to DB: " . $conn->connect_error);
}

//sql query to find user
$sql = "SELECT ID, password FROM users WHERE username='" . $username . "'";
$result = $conn->query($sql);

//check if users match
    if ($result->num_rows > 0)
    {
        //fetch first row
        $row = $result->fetch_assoc();
        
        //compare password from the request with db value
        if ($password === $row["password"])
        {
            //successful login
            returnWithInfo($row["ID"], $username);
        }
        else
        {
            //password did not match
            returnWithError("Invalid password.");
        }
    }
    else
    {
        //no matching username in db
        returnWithError("User not found.");
    }

		$conn->close();
?>