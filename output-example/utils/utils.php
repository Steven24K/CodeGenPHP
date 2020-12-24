<?php 


function allow_request_methods($allowed) {
    $method = $_SERVER["REQUEST_METHOD"];
    return in_array($method, $allowed);
}

?>