<?php 

require_once('../../../utils/DefaultHeaders.php');
require_once('../../../utils/DbConnection.php');
require_once('../../../utils/HttpResult.php');
require_once('../../../utils/utils.php');


if (!allow_request_methods(["POST"])) {
    die("Request not allowed");
}


session_start();
$allowed_roles = ['admin'];
if (isset($_SESSION['id']) and isset($_SESSION['role'])) {
    if (in_array($_SESSION['role'], $allowed_roles)) {
        // You have permission to complete the request
        

        $data = json_decode(file_get_contents("php://input")); 
        $connection = new DbConnection();
        
        
        if (isset($data->ProductName) and isset($data->Description) and isset($data->Price)) {
            $last_id = $connection->ExecuteQuery("INSERT INTO product(ProductName, Description, Price) VALUES ('$data->ProductName','$data->Description', $data->Price)");
            echo json_encode(new HttpResult($last_id, 200));
        } else {
            echo json_encode(new HttpResult(-1, 402));
        }

        // End permission block
    } else {
        echo json_encode(new HttpResult("No permission", 403));
    }
} else {
    echo json_encode(new HttpResult("Not logged in", 403));
}



?>