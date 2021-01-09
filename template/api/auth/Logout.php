<?php 

require_once('../../../utils/DefaultHeaders.php');
require_once('../../../utils/DbConnection.php');
require_once('../../../utils/HttpResult.php');
require_once('../../../utils/utils.php');
require_once('../../../config.php');

if (!allow_request_methods(["GET"])) {
    die("Request not allowed");
}


session_start();

if (isset($_SESSION['id'])) {
    session_destroy();
    echo json_encode(new HttpResult('Succesfully logged out', 200));
} else {
    echo json_encode(new HttpResult('Not logged in', 200));
}

?>