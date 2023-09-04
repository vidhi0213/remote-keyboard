<?php
session_start();

// Initialize key colors
if (!isset($_SESSION['keyColors'])) {
    $_SESSION['keyColors'] = array_fill(0, 10, 'white');
}

// Handle AJAX requests
if (isset($_POST['action'])) {
    if ($_POST['action'] === 'acquireControl') {
        $_SESSION['userControl'] = true;
        echo 'success';
    } elseif ($_POST['action'] === 'toggleKeyColor' && isset($_SESSION['userControl'])) {
        $key = $_POST['key'] - 1;
        if ($_SESSION['keyColors'][$key] === 'white') {
            $_SESSION['keyColors'][$key] = ($_SESSION['userControl']) ? 'red' : 'yellow';
        } else {
            $_SESSION['keyColors'][$key] = 'white';
        }
        $_SESSION['userControl'] = false;
        echo 'success';
    } elseif ($_POST['action'] === 'getKeyColors') {
        echo json_encode($_SESSION['keyColors']);
    }
}
?>
