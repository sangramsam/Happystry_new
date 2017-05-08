
angular.module('Happystry.controllers').controller('timelineController', ['Settings','ViewService','$scope', '$http', 'roundProgressService', 'likeFuntion', '$compile', '$rootScope', 'angularGridInstance', '$location', '$window', 'ViewService2', 'dynamicNotifications', '$localStorage',
        function (Settings,ViewService,$scope, $http, roundProgressService, likeFuntion, $compile, $rootScope, angularGridInstance, $location, $window, ViewService2, dynamicNotifications, $localStorage) {
            ViewService.getTrendingHashTag().then(function (response) {
                $scope.getTrendingData = response.data.trending;
            }, function (response) {
            });
            function loadFirstTime() {
                ViewService.getFeeds({page: 0}).then(function (response) {
                    $scope.getPostData = response.data.Posts;
                    $scope.getPromotedData = response.data.Promoted;
                }, function (response) {
                });
            }
            loadFirstTime();
            $scope.roundProgress = ViewService.roundProgressInitialization();
            $scope.getColor = function () {
                return $scope.gradient ? 'url(#gradient)' : $scope.roundProgress.currentColor;
            };
            ViewService.getCollections().then(function (response) {
                $scope.getCollectionData = response.data.collections;
            }, function (response) {
            });

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

            $scope.fcClk = function ($event) {
                angular.element('.sub-menu').removeClass('ngshow');
                angular.element($event.currentTarget).next('.sub-menu').addClass('ngshow');
                $event.stopPropagation();
            }



            //get location
            $scope.getGeoFeeds = function (nearMe) {
                page = 0;
                page1 = 10;
                if (nearMe) {
                    $scope.removeNearMe();
                } else {
                    $scope.geoGlobal = $scope.geoLoc;
                    location_area1 = $scope.geoLoc;
                    lat = $scope.getGeoLat;
                    lng = $scope.getGeoLng;
                    ViewService.getFilterLocation(lng,lat,page).then(function (response) {
                        $scope.getPostData = response.data.Posts;
                        $scope.getPromotedData = response.data.Promoted;
                    })
                }
            }
            var geo_lat = 0;
            var geo_lng = 0;
            function PositionUpdate(position) {
                //happysty8@gmail.com
                geo_lat = position.coords.latitude;
                geo_lng = position.coords.longitude;
                var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + geo_lat + "," + geo_lng + "&sensor=true&key=AIzaSyDGqM2CkJ6-iOYasbUGKB807d8Z8KdjoSU";
                $http.get(url)
                    .then(function (result) {
                        for (var i = 0; i < result.data.results[0].address_components.length; i++) {
                            for (var b = 0; b < result.data.results[0].address_components[i].types.length; b++) {
                                if ((result.data.results[0].address_components[i].types[1] == "sublocality") && (result.data.results[0].address_components[i].types[2] == "sublocality_level_1")) {
                                    $scope.area = result.data.results[0].address_components[i];
                                }
                                if ((result.data.results[0].address_components[i].types[0] == "locality") && (result.data.results[0].address_components[i].types[1] == "political")) {
                                    $scope.city = result.data.results[0].address_components[i];
                                }
                            }
                        }
                        var geoLocation = '';
                        geoLocation = $scope.area.short_name + ',' + $scope.city.short_name;
                        ViewService2.geo_location = geoLocation;
                        ViewService2.geo_lat = geo_lat;
                        ViewService2.geo_lng = geo_lng;
                        ViewService2.locationauto = true;
                        $scope.geoLoc = geoLocation;
                        $scope.getGeoLat = geo_lat;
                        $scope.getGeoLng = geo_lng;
                    });
            }
            if (navigator.geolocation) {
//
                navigator.geolocation.getCurrentPosition(PositionUpdate, showError, {maximumAge: 60000, timeout: 7000, enableHighAccuracy: true});
//                    }
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
            function showError(error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.log("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        console.log("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.log("An unknown error occurred.");
                        break;
                }
            }
            $scope.getGeoLoc = function () {
                if ($scope.filLoc === 0) {
                    $scope.location = $scope.geoLoc;
                    location_area1 = $scope.geoLoc;
                    lat = $scope.getGeoLat;
                    lng = $scope.getGeoLng;
                    $scope.filLoc = 1;
                } else {
                    $scope.location = '';
                    location_area1 = '';
                    lat = '';
                    lng = '';
                    $scope.filLoc = 0;
                }
            }
            $scope.removeNearMe = function () {
                $scope.geoGlobal = '';
                loadFirstTime();
            }
        }]);

