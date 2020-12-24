<?php 

require_once('./utils/DbConnection.php');
$connection = new DbConnection();

$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS blog(
    Id INT AUTO_INCREMENT, 
    title TEXT, 
    body TEXT,
    PRIMARY KEY (Id)
);");

$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS tag(
    Id INT AUTO_INCREMENT, 
    tagName TEXT, 
    PRIMARY KEY (Id)
);");

$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS externallink(
    Id INT AUTO_INCREMENT, 
    linkText TEXT, 
    href TEXT,
    PRIMARY KEY (Id)
);");


// N-N
$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS blog_tag(
    Id INT AUTO_INCREMENT, 
    tagId INT, 
    blogId INT,
    PRIMARY KEY (Id),
    FOREIGN KEY (tagId) REFERENCES tag(Id),
    FOREIGN KEY (blogId) REFERENCES blog(Id)
);");

// 1-1
$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS blog_externallink(
    blogId INT, 
    externallinkId INT,
    PRIMARY KEY (blogId),
    FOREIGN KEY (externallinkId) REFERENCES externallink(Id),
    FOREIGN KEY (blogId) REFERENCES blog(Id)
);");

?>