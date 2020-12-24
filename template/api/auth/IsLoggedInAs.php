<?php 

require_once('../../../utils/DefaultHeaders.php');
require_once('../../../utils/DbConnection.php');
require_once('../../../utils/HttpResult.php');
require_once('../../../utils/utils.php');
require_once('../../../config.php');

if (!allow_request_methods(["POST"])) {
    die("Request not allowed");
}

/**
 * {
 *   "Id": 1, 
 *   "role": "admin"
 * }
 */
$data = json_decode(file_get_contents("php://input")); 

session_start();

if (isset($data->Id) and isset($data->role) and isset($_SESSION['id']) and isset($_SESSION['role'])) {
    if ($data->Id === $_SESSION['id'] and $data->role === $_SESSION['role']) {
        echo json_encode(new HttpResult(TRUE, 200));
    } else {
        echo json_encode(new HttpResult(FALSE, 403));
    }
} else {
    echo json_encode(new HttpResult(FALSE, 403));
}

?>