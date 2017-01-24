bookmarksApp.filter("httpFilter", function () {
    return function (url) {
        return "http://" + url;
    }
});