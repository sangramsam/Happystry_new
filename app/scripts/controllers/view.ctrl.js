
angular.module('Happystry.controllers').controller('timelineController', ['Settings','ViewService','$scope', '$http', 'roundProgressService', 'likeFuntion', '$compile', '$rootScope', 'angularGridInstance', '$location', '$window', 'ViewService2', 'dynamicNotifications', '$localStorage',
        function (Settings,ViewService,$scope, $http, roundProgressService, likeFuntion, $compile, $rootScope, angularGridInstance, $location, $window, ViewService2, dynamicNotifications, $localStorage) {
            ViewService.getTrendingHashTag().then(function (response) {
                $scope.getTrendingData = response.data.trending;
            }, function (response) {
            });
            ViewService.getFeeds({page: 0}).then(function (response) {
                $scope.getPostData = response.data.Posts;
                $scope.getPromotedData = response.data.Promoted;
            }, function (response) {
            });
            $scope.roundProgress = ViewService.roundProgressInitialization();
            $scope.getColor = function () {
                return $scope.gradient ? 'url(#gradient)' : $scope.roundProgress.currentColor;
            };
        }]);

