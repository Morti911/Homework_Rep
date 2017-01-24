bookmarksApp.controller("bookmarksListCtrl", function($scope, $http) {

    $scope.deleteBookmark = function(id) {
        for(var i in $scope.list.bookmarks) {
            if ($scope.list.bookmarks[i].id == id) {
                $scope.list.bookmarks.splice(i, 1);

                var data = {
                    action: "remove",
                    index : i
                };

                $http({
                    method: 'POST',
                    url: "model/bookmarksModel.php",
                    data: data
                }).success(function (data) {
                    var element = angular.element("<p class='alert'></p>");
                    if (data) {
                        element.addClass("alert-info").text("Element removed");
                    } else {
                        element.addClass("alert-danger").text("Element NOT removed");
                    }

                    var parent = angular.element(document.querySelector("table"));
                    parent.append(element);
                })
            }
        }
    };

    $scope.tableRowHover = function(e) {
        (e.type == "mouseover") ? this.tableRowHoverClass = "warning" : this.tableRowHoverClass = "";
    };


});