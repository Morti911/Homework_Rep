bookmarksApp.directive('displayTag', function() {
    return {
        restrict: 'E',
        scope: {
            tag: '=tag',
            bookmarkId: "=bookmarkId",
        },
        template: '<span class="label" style="background-color:{{tag.color}};">{{tag.name}} </span>',
    };
});

