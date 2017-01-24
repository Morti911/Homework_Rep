bookmarksApp.controller("addFormCtrl", function($scope, $http){
    $scope.addBookmark = function(newBookmark, addForm) {
        if (addForm.$valid) {
            var item = {
                id: Date.now(),
                name: newBookmark.name,
                url: newBookmark.url,
                description: newBookmark.description,
                tags: newBookmark.tag
        };

            $scope.list.bookmarks.push(item);

            var data = {
                element: item,
                action: "add"
            };

            $http({
                method: 'POST',
                url:"model/bookmarksModel.php",
                data: data})
                .success(function (data) {
                var element = angular.element("<p class='alert'></p>");
                if (data) {
                    element.addClass("alert-info").text("Element added");
                } else {
                    element.addClass("alert-danger").text("Element NOT added");
                }

                var parent = angular.element(document.querySelector("form"));
                parent.append(element);
            })
        }
    };



});