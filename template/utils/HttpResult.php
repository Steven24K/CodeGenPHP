<?php 

class HttpResult {
    public $_status; 
    public $_value;
    function __construct($value, $status) {
        $this->_status = $status;
        $this->_value = $value;
    }
}

?>