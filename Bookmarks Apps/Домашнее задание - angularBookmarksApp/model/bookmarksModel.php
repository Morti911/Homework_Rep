<?php

$request = file_get_contents("php://input");
$model = file_get_contents("bookmarks.json");

if($request) {
    if (json_decode($request)->action == "remove"){
        $index = (int)json_decode($request)->index;
        $bookmarkList = json_decode($model);
        unset($bookmarkList->bookmarks[(int)$index]);
        $model = json_encode($bookmarkList);
        file_put_contents("bookmarks.json",$model);
        echo true;
    }
    if (json_decode($request)->action == "add"){
        $newBookmark = json_decode($request)->element;
        $bookmarkList = json_decode($model);
        array_push($bookmarkList->bookmarks, $newBookmark);
        $model = json_encode($bookmarkList);
        file_put_contents("bookmarks.json",$model);
        echo true;
    }

} else {
    echo $model;
}

