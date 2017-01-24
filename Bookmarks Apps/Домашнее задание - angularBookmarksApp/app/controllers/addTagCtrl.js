bookmarksApp.controller("addTagCtrl", function($scope, $http) {
        $scope.tags = [];

        $http.get('model/tags.json').success(function(data) {
            $scope.tags = data;

            var tagNames = [];
            $scope.tags.forEach(function(tag) {
                tagNames.push(tag.name);
            });

        });


        $scope.addTag = function(input) {
            var tag = {"id": Date.now(), "name": input.name, "color": input.color};
            $scope.tags.push(tag);
            input.name = "";
            input.color = "";
        }


});
