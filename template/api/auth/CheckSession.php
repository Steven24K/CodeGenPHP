<?php 

require_once('../../../utils/DefaultHeaders.php');
require_once('../../../utils/DbConnection.php');
require_once('../../../utils/HttpResult.php');
require_once('../../../utils/utils.php');
require_once('../../../config.php');

session_start();

if (isset($_SESSION["id"]) and isset($_SESSION["role"])) {
    echo json_encode(new HttpResult([
        "id" => $_SESSION["id"], 
        "role" => $_SESSION["role"]
    ], 200));
} else {
    echo json_encode(new HttpResult("Please sign in", 403));
}


?>