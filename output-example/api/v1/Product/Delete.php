<?php 


require_once('../../../utils/DefaultHeaders.php');
require_once('../../../utils/DbConnection.php');
require_once('../../../utils/HttpResult.php');
require_once('../../../utils/utils.php');

if (!allow_request_methods(["DELETE"])) {
    die("Request not allowed");
}

$connection = new DbConnection();

$id = $_GET["Id"];

if (isset($id)) {
    $result = $connection->ExecuteQuery("DELETE FROM product WHERE Id = $id");
    if ($result === TRUE) {
        echo json_encode(new HttpResult($result, 200));
    } else {
        echo json_encode(new HttpResult($result, 500));
    }
} else {
    echo json_encode(new HttpResult("Invalid parameters", 500));
}

?>