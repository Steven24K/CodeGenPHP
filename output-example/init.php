<?php 

require_once('./utils/DbConnection.php');


$connection = new DbConnection();

// Create models
$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS admin(
    Id INT AUTO_INCREMENT, 
    Name TEXT, 
    Password TEXT, 
    Email TEXT, 
    PRIMARY KEY (Id)
);");

$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS customer(
    Id INT AUTO_INCREMENT, 
    FirstName TEXT, 
    LastName TEXT, 
    Email TEXT,
    Password TEXT, 
    PRIMARY KEY (Id)
);");

$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS product(
    Id INT AUTO_INCREMENT, 
    ProductName TEXT, 
    Description TEXT, 
    Price FLOAT, 
    PRIMARY KEY (Id)
);");

$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS orderinfo(
    Id INT AUTO_INCREMENT, 
    Quantity INT, 
    PRIMARY KEY (Id)
);");


// Create Relations 

// 1-N
$connection->ExecuteQuery("CREATE TABLE customer_orderinfo(
    orderinfoId INT, 
    customerId INT, 
    PRIMARY KEY (orderinfoId),
    FOREIGN KEY (orderinfoId) REFERENCES orderinfo(Id),
    FOREIGN KEY (customerId) REFERENCES customer(Id)
);");

// N-N
$connection->ExecuteQuery("CREATE TABLE IF NOT EXISTS product_orderinfo(
    Id INT AUTO_INCREMENT, 
    OrderInfoId INT,
    ProductId INT,
    PRIMARY KEY (Id),
    FOREIGN KEY (OrderInfoId) REFERENCES orderinfo(Id),
    FOREIGN KEY (ProductId) REFERENCES product(Id)
);");


?>