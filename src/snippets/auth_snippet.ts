import { Model } from "../Spec/Model";
import { Snippet } from "../utils/types";
import { PhpCode } from "./api_snippets";

const login_switch_body = (model: Model): string => {
    let username = model.attributes.findEntry((attr) => attr.type == 'USERNAME')
    let password = model.attributes.findEntry((attr) => attr.type == 'PASSWORD')
    if (username == undefined || password == undefined) {
        console.error(`${model.name} is marked as 'can_login', but is missing an USERNAME or PASSWORD attribute type`)
        throw `Loggable entity is missing a PASSWORD or USERNAME attribute type`
    }

    return `
    case "${model.name}":
        if (isset($data->${username[1].name}) and isset($data->${password[1].name})) { // generated variables
            $encrypted_password = md5($data->${password[1].name}); // Password can be called anything
            $sql = "SELECT Id FROM $data->role WHERE ${username[1].name} = '$data->${username[1].name}' and ${password[1].name} = '$encrypted_password'"; // UserName can be anything
            $result = $connection->GetQueryResult($sql);
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    session_start();
                    $_SESSION['id'] = $row['Id'];
                    $_SESSION['role'] = $data->role;
                    break;
                }
                echo json_encode(new HttpResult("Logged in succesfully", array(
                    "id" -> $_SESSION["id"],
                    "role" -> $_SESSION["role"]
                )));
            } else {
                echo json_encode(new HttpResult("Wrong credentials", 403));
            }
        } else {
            echo json_encode(new HttpResult("Incomplete request", 201));
        }
        break;
    `
}

export const login_snippet = (models: Model[], api_version: string): Snippet => {
    return ({
        name: `api/${api_version}/auth/Login.php`,
        content: PhpCode(`
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
 *    "role": "user" <-- The role is the table where we select from. 
 * }
 */
$data = json_decode(file_get_contents("php://input")); 

//if (isset($data->UserName) and isset($data->Password) and isset($data->role)) {
if (isset($data->role)) {
    if (in_array($data->role, LOGGABLE_ENTITIES)) {

        //Entities can have any attrubute set as username or password 

        switch ($data->role) {
            ${models.filter(m => m.can_login).map(login_switch_body).reduce((xs, x) => xs + x ,'')}
            default: 
                echo json_encode(new HttpResult("Role $data->role does not exists", 201));
                break;
        }

    } else {
        echo json_encode(new HttpResult("Role: " . $data->role . " does not exists", 200));
    }
} else {
    echo json_encode(new HttpResult("Not all fields are filled in correctly", 203));
}
        `)
    })
}