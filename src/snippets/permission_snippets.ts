import { Application } from "../Spec/Application"
import { Model } from "../Spec/Model"
import { Snippet } from "../utils/types"
import { PhpCode } from "./api_snippets"

export const Permission_snippet = (allowed_roles: string[], code: string) => `
session_start();
$allowed_roles = [${allowed_roles.reduce((xs, x) => xs + `'${x}', `, '')}];
if (isset($_SESSION['id']) and isset($_SESSION['role'])) {
    if (in_array($_SESSION['role'], $allowed_roles)) {
        // You have permission to complete the request

        ${code}

        // End permission block
    } else {
        echo json_encode(new HttpResult("No permission", 403));
    }
} else {
    echo json_encode(new HttpResult("Not logged in", 403));
}
`

const permission_switch = (case_name: string, returns: string[]) => `
case '${case_name}':
    return ${returns.length > 0 ? returns.reduce((xs, x, i) => xs + `$role === '${x}'${returns.length - 1 == i ? '' : ' or '}`, '') : 'true'};
`

export const getEntitiesBasedOnRole_snippet = (app: Application) => (models: Model[]): Snippet => ({
    name: `api/${app.api_version}/extras/getEntitiesBasedOnRole.php`,
    content: PhpCode(`
    require_once('../../../utils/DefaultHeaders.php');
require_once('../../../utils/DbConnection.php');
require_once('../../../utils/HttpResult.php');
require_once('../../../utils/utils.php');
require_once('../../../config.php');


class Entity {
    function __construct($_entity, $_can_create, $_can_view, $_can_edit, $_can_delete) {
        $entity = $_entity;
        $can_create = $_can_create;
        $can_view = $_can_view;
        $can_edit = $_can_edit;
        $can_delete = $_can_delete;
    }
}

function can_view($entity, $role) {
    switch ($entity) {
        ${models.map(m => permission_switch(m.name, m.permissions.read.toArray())).reduce((xs, x) => xs + x, '')}
    }
}
                
function can_create($entity, $role) {
    switch ($entity) {
        ${models.map(m => permission_switch(m.name, m.permissions.create.toArray())).reduce((xs, x) => xs + x, '')}
        default:
            return false;
    }
}

function can_edit($entity, $role) {
    switch ($entity) {
        ${models.map(m => permission_switch(m.name, m.permissions.update.toArray())).reduce((xs, x) => xs + x, '')}
            default:
                return false;
        }
    }
                
function can_delete($entity, $role) {
    switch ($entity) {
        ${models.map(m => permission_switch(m.name, m.permissions.update.toArray())).reduce((xs, x) => xs + x, '')}
            default:
                return false;
        }
    }
    
    
    session_start();
    if (isset($_SESSION["id"]) and isset($_SESSION["role"])) {
        $id = $_SESSION["id"];
        $role = $_SESSION["role"];

    $entities = array(
        ${models.map(m => `'${m.name}'`).toString()}
    );

    $permissions = array_map(function ($e) {
        global $role;
        return array(
            "entity" => $e,
            "can_create" => can_create($e, $role), 
            "can_view" => can_view($e, $role), 
            "can_edit" => can_edit($e, $role), 
            "can_delete" => can_delete($e, $role)
            );
    }, $entities);

    $result = array();
    foreach ($permissions as $value) {
        global $role; 
        if ($value["can_view"]) {
            array_push($result, $value);
        }
    }

    echo json_encode(new HttpResult($result, 200));
} else {
    echo json_encode(new HttpResult([], 403));
}
    `)
})