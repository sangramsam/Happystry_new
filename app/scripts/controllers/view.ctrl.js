
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

            //like
            $scope.sendLike = function (postid, event) {
                if ($scope.logged_res == true) {
                    $scope.loggin_pop(event);
                } else {
                    likeFuntion.sendLike(postid, event);
                }
            };
            $scope.loggin_pop = function (e) {
                jQuery.fancybox({
                    'href': '#loginPop',
                    'closeBtn': true,
                    keys: {
                        close: null
                    }
                });
                e.preventDefault();
            }
        }]);

