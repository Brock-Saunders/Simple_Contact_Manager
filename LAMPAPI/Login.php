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
    sendResultInfoAsJson($retValue);
    exit();
}

//returns a success message w/ user id in json format
function returnWithInfo($id, $username){
	$retValue = '{"id":' . $id . ',"username":"' . $username . '","error":""}';
	sendResultInfoAsJson($retValue);
}

//grab json data
$inData = getRequestData();

//extract user and password
$username = $inData["username"];
$password = $inData["password"];

//if missing either
if ($username === "" || $password === "") {
    returnWithError("Missing username or password");
}

//connect to db
$conn = new mysqli("localhost", "root", "testpass", "contact");
//check if connection fails
if($conn->connect_error){
    returnWithError("Couldnt Connect to DB: " . $conn->connect_error);
}

//sql query to find user
$stmt = $conn->prepare("SELECT ID, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

//check if users match
if ($result->num_rows > 0){
    //fetch first row
    $row = $result->fetch_assoc();
    
    //compare password from the request with db value
    if ($password === $row["password"]){
        //successful login
        returnWithInfo($row["ID"], $username);
    }
    else{
        //password did not match
        returnWithError("Invalid password.");
    }
}
else{
    //no matching username in db
    returnWithError("User not found.");
}

$stmt->close();
$conn->close();
