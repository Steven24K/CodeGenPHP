export const Permission_snippet = (allowed_roles: string[], code: string) => `
session_start();
$allowed_roles = [${allowed_roles.reduce((xs, x) => xs + `'${x}', ` , '')}];
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