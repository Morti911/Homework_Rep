angular.module('bookmarksApp')
    .service('tagsService', function($http, $q, $filter) {


        return {
            getTags: function(options) {
                var deferred = $q.defer();

                var localTags = (options && options.forceRefresh)
                    ? null
                    : localStorage.getItem('tags');

                if (localTags) {
                    deferred.resolve(JSON.parse(localTags));
                } else {
                    $http.get('tags.json')
                        .success(function(tags) {
                            localStorage.setItem('tags', JSON.stringify(tags.results));

                            deferred.resolve(tags.results);
                        });
                }

                return deferred.promise;
            },
            saveTags: function(tags) {
                var deferred = $q.defer();

                localStorage.setItem('tags', JSON.stringify(users));
                deferred.resolve();

                return deferred.promise
            },
            getTagByName: function(tagId) {
                var users = JSON.parse(localStorage.getItem('tags'));

                return $filter('filter')(tags, {id: tagId})[0];
            },
            saveTagToBookmark: function(tag) {
                var tags = JSON.parse(localStorage.getItem('tags'));

                angular.forEach(users, function(item, key) {
                    if (item.id === tag.id) {
                        tags[key] = tag;
                    }
                });

                localStorage.setItem('tags', JSON.stringify(tags));
            }
        };
    });