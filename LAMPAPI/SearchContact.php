<?php


function getRequestData(){
    return json_decode(file_get_contents('php://input'), true);
}


function sendResultAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}


function returnWithError($err){
    $retValue = json_encode(["error" => $err]);
    sendResultAsJson($retValue);
    exit();
}

$inData = getRequestData();

$conn = new mysqli("localhost", "webuser", "PersonaGaru18", "contact");

if($conn->connect_error){
    returnWithError("Couldn't Connect to DB: " . $conn->connect_error);
}

else{
    $searchTerm = "%" . $inData["search"] . "%";

    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, Phone FROM Contacts WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ?)");
    $stmt->bind_param("issss", $userID, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
    
    if($stmt->execute()){
        $result = $stmt->get_result();

        if($result->num_rows > 0){
            $contacts = [];
            while($row = $result->fetch_assoc()){
                $contacts[] = $row; 
            }
        }

        else{
            returnWithError("No Search Results");
        } 
    }

    else{
        returnWithError("Error: Something Went Wrong With Search" . $stmt->error);
    }

$stmt->close();
$conn->close();

$retValue = json_encode(["Contacts" => $contacts]);
sendResultAsJson($retValue);

}