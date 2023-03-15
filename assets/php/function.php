<?php

include('config.php');

// include $_SERVER['DOCUMENT_ROOT'] . "/assets/php/config.php";
// include $_SERVER['DOCUMENT_ROOT'] . "/assets/php/jdf.php";

if (isset($_POST['fun'])) {

    $fun = $_POST['fun'];
    switch ($fun) {

        case 'newest':
            Newest();
            break;
    }
}


function Newest()
{
    global $con;

    $query = 'SELECT * FROM `TBSong` ORDER BY `id` DESC';
    $query = str_replace(";", "", $query);
    $stmt = $con->prepare($query);
    $stmt->execute();

    echo json_encode($stmt->fetchAll(PDO::FETCH_OBJ));

    $con = null;
}













// $mobile = $_POST['mobile'];
// // echo json_encode($mobile);

// global $con ;
// $query = 'SELECT * FROM `tbverifycode` WHERE Mobile = :mobile';
// $query = str_replace(";", "", $query);
// $stmt = $con->prepare($query);
// $stmt->bindValue(':mobile', $mobile , PDO::PARAM_INT);
// $stmt->execute();
// if ($stmt) {
//     echo json_encode($stmt->fetchAll(PDO::FETCH_OBJ));
// } else {
//     echo "Error";
// }
// $con = null;
