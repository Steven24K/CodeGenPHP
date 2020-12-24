<?php 

require_once('../../../utils/DefaultHeaders.php');
require_once('../../../utils/DbConnection.php');
require_once('../../../utils/HttpResult.php');
require_once('../../../utils/utils.php');
require_once('../../../config.php');

if (!allow_request_methods(["POST"])) {
    die("Request not allowed");
}

$connection = new DbConnection();

/**
 * Login data will be send through a post request 
 * {
 *    "UserName": "user1", 
 *    "Password": "test1234", 
 *    "role": "user" <-- The role is basically the table where we select from. 
 * }
 */
$data = json_decode(file_get_contents("php://input")); 

if (isset($data->UserName) and isset($data->Password) and isset($data->role)) {
    if (in_array($data->role, LOGGABLE_ENTITIES)) {
        $encrypted_password = sodium_crypto_pwhash_scryptsalsa208sha256_str($data->Password);
        $sql = "SELECT Id FROM $role WHERE UserName = $data->UserName and Password = $encrypted_password";
        $result = $connection->ExecuteQuery($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                session_start();
                $_SESSION['id'] = $row['Id'];
                $_SESSION['role'] = $data->role;
                break;
            }
            echo json_encode(new HttpResult("Logged in succesfully", 200));
        } else {
            echo json_encode(new HttpResult("Wrong credentials", 200));
        }
    } else {
        echo json_encode(new HttpResult("Role: " . $data->role . " does not exists", 200));
    }
} else {
    echo json_encode(new HttpResult("Not all fields are filled in correctly", 203));
}



?>