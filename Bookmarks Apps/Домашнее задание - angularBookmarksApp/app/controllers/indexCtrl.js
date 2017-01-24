bookmarksApp.controller("indexCtrl", function($scope, $http) {

    $http.get("model/bookmarksModel.php").success(function (data) {
        $scope.list = data;
    });

    $scope.headerClass = "info";
    $scope.tableRowClass = "active";


});