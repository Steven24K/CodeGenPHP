<?php 

require_once('../../../utils/DefaultHeaders.php');
require_once('../../../utils/DbConnection.php');
require_once('../../../utils/HttpResult.php');
require_once('../../../utils/utils.php');

if (!allow_request_methods(["PUT"])) {
    die("Request not allowed");
}

$data = json_decode(file_get_contents("php://input")); 
$connection = new DbConnection();



if (isset($data->Id) and isset($data->ProductName) and isset($data->Description) and isset($data->Price)) {
    $result = $connection->ExecuteQuery("UPDATE product SET ProductName = '$data->ProductName', Description = '$data->Description', Price = $data->Price WHERE Id = $data->Id");
    
    if ($result === TRUE) {
        echo json_encode(new HttpResult($result, 200));
    } else {
        echo json_encode(new HttpResult($result, 500));
    }
} else {
    echo json_encode(new HttpResult('Not all fields are filled in correctly', 402));
}

?>