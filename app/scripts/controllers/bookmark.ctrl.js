angular.module('Happystry.controllers')
    .controller('bookmark', ['$scope', '$http', 'ViewService', '$rootScope', 'Settings', function ($scope, $http, ViewService, $rootScope, Settings) {
        'use strict';
        var page = 0;
        $scope.contentLoaded=false;
        ViewService.getBookmark(page).then(function (response) {
            console.log("bookmark", response);
            $scope.getBookmarkData = response.data.Bookmarks.Posts;
            $scope.BookmarkDataCnt = response.data.Bookmarks.book_cnt;
            $scope.totBkmrkCnt = ($scope.getBookmarkData).length;
            $rootScope.bookLoaded = true;
            $scope.contentLoaded=true;
            angular.forEach($scope.getBookmarkData, function (v, k) {
                var splitRowObject = v.location.split(',');
                if (splitRowObject.length > 0)
                    $scope.getBookmarkData[k].location = splitRowObject[0];
            });
        })
    }]);
