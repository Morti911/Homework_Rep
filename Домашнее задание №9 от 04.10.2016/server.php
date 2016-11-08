<?php
    $users = array("John" => "user", "Alex" => "admin", "David" => "user", "Jeremy" => "admin");

    if ($_POST["name"] || $_POST["role"]) {
        $name = $_POST["name"];
        $role = $_POST["role"];

        setUserView($name, $role);
    }

    if ($_GET["list"] == "show") {
        showList($users);
    }

    function setUserView ($name, $role = "") {
        if ($role == "admin") {
            echo $name = "<li><strong>".$name."</strong></li>";
        } else {
            echo $name = "<li>".$name."</li>";
        }
    };

    function showList($users) {
        foreach ($users as $key => $value) {
            if ($value == "admin") {
                echo "<li><strong>".$key."</strong></li>";
            } else {
                echo "<li>".$key."</li>";
            }
        }
    }
?>