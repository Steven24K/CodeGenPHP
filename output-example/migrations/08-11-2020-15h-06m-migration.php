<?php 

require_once('./utils/DbConnection.php');
$connection = new DbConnection();

// 1-N
$connection->ExecuteQuery("CREATE TABLE admin_blog(
    blogId INT, 
    adminId INT, 
    PRIMARY KEY (blogId),
    FOREIGN KEY (blogId) REFERENCES blog(Id),
    FOREIGN KEY (adminId) REFERENCES admin(Id)
);");
?>