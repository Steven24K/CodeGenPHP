<?php


class Database {

    function __construct($servername, $username, $password) {
        $this->_conn = new mysqli($servername, $username, $password);
    }

    function __destruct() {
        $this->_conn->close();
    }

    function make($dbname) {
        $sql = "CREATE DATABASE IF NOT EXISTS $dbname;";
        if ($this->_conn->query(($sql)) === TRUE) {
            return TRUE;
        } 
        return $this->error;
    }
}

// TODO: Escape all queries before send to the database!

class DbConnection {
    private $_servername = DB_HOST;
    private $_username = DB_USER;
    private $_password = DB_PASSWORD;
    private $_dbname = DB_NAME;

    function __construct() {
        // To ensure datbase exists
        $db = new Database($this->_servername, $this->_username, $this->_password);
        $db->make($this->_dbname);


        $this->_conn = new mysqli($this->_servername, $this->_username, $this->_password, $this->_dbname);
        if ($this->_conn->connect_error) {
            die("Connection failed " . $this->_conn->connect_error);
        }

    }

    function GetQueryResult($query) {
        $result = $this->_conn->query(($query));
        return $result;
    }

    function ExecuteQuery($query) {
        if ($this->_conn->query(($query)) === TRUE) {
            if ($this->_conn->insert_id !== NULL) {
                return $this->_conn->insert_id;
            }
            return TRUE;
        } 
        return $conn->error;    
    }

    function __destruct() {
        $this->_conn->close();
    }
}


?>