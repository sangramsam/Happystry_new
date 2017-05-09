angular.module('Happystry.controllers').controller('timelineController', ['Settings', '$document', 'ViewService', '$scope', '$http', 'roundProgressService', 'likeFuntion', '$compile', '$rootScope', 'angularGridInstance', '$location', '$window', 'ViewService2', 'dynamicNotifications', '$localStorage',
    function (Settings, $document, ViewService, $scope, $http, roundProgressService, likeFuntion, $compile, $rootScope, angularGridInstance, $location, $window, ViewService2, dynamicNotifications, $localStorage) {
        $scope.pageFlag = 0;
        $scope.totalPosts=0;
        $scope.getPostData = [];
        $scope.getPromotedData = [];
        $scope.loadmore = false;
        $scope.nomoreFeed=false;
        var scroll=true;
        ViewService.getTrendingHashTag().then(function (response) {
            $scope.getTrendingData = response.data.trending;
        }, function (response) {
        });
        function loadFirstTime() {
            ViewService.getFeeds({page: $scope.pageFlag}).then(function (response) {
                if( response.data.Posts.length===0 &&response.data.Promoted.length===0){
                    $scope.nomoreFeed=true;
                }else{
                    $scope.nomoreFeed=false;
                }
                $scope.totalPosts=response.data.post_count;
                $scope.getPostData = response.data.Posts;
                $scope.getPromotedData = response.data.Promoted;
                $scope.pageFlag += 10;
                $scope.loadmore = true;
            }, function (response) {
            });
        }
        function lazyloadingforPostdata() {
            ViewService.getFeeds({page: $scope.pageFlag}).then(function (response) {
                scroll = true;
                if( response.data.Posts.length===0 &&response.data.Promoted.length===0){
                    console.log("empty data")
                    $scope.nomoreFeed=true;
                }else{
                    $scope.nomoreFeed=false;
                }
                $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
                $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);
                $scope.pageFlag += 10;
                $scope.loadmore = true;

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
                likeFuntion.sendLike(postid, event,function (response) {

                    console.log("like response",response)
                });
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
                ViewService.getFilterLocation(lng, lat, page).then(function (response) {
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
            navigator.geolocation.getCurrentPosition(PositionUpdate, showError, {
                maximumAge: 60000,
                timeout: 7000,
                enableHighAccuracy: true
            });
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


        //lazy loading
        angular.element($document).on('scroll', function () {
            /* scroll to end */
            var footer_distance = 80;
            var document_height = $(document).height();

            var relative = $('.loadmore-relative').offset().top;

            if (($('.loadmore-relative').isOnScreen() === true || $(this).scrollTop() >= relative) && scroll === true &&  ($scope.pageFlag < $scope.totalPosts)) {
                console.log("scroll called !!");
                scroll = false;
                lazyloadingforPostdata();
            }


        });

        $.fn.isOnScreen = function () {
            var win = $(window);

            var viewport = {
                top: win.scrollTop(),
                left: win.scrollLeft()
            };
            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();

            var bounds = this.offset();
            bounds.right = bounds.left + this.outerWidth();
            bounds.bottom = bounds.top + this.outerHeight();

            return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
        };
    }]);

