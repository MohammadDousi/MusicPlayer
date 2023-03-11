<?php

$host = "localhost";
$dbname = "peccawoq_DBMusicPlayer";
$username = "root";
$password = "";

try {
    $con = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

    $con->setAttribute(PDO::ATTR_EMULATE_PREPARES, TRUE);
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // $con->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, TRUE);
    // $con->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND,"SET NAMES utf8");
    $con->setAttribute(PDO::ATTR_AUTOCOMMIT, TRUE);
    // echo "Connected successfully";

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
