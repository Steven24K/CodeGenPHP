<?php 

$MIGRATIONS_DIR = 'migrations/';

foreach (glob($MIGRATIONS_DIR . "*.php") as $filename) {
    require_once($filename);
    echo $filename."<br>";
   }

?>