angular.module('Happystry.controllers').controller('timelineController', ['Settings','Location','CountryCode', '$document', 'ViewService', '$scope', '$http', 'roundProgressService', 'likeFuntion', '$compile', '$rootScope', 'angularGridInstance', '$location', '$window', 'ViewService2', 'dynamicNotifications', '$localStorage',
    function (Settings,Location,CountryCode, $document, ViewService, $scope, $http, roundProgressService, likeFuntion, $compile, $rootScope, angularGridInstance, $location, $window, ViewService2, dynamicNotifications, $localStorage) {
        $scope.pageFlag = 0;
        $scope.totalPosts=0;
        $scope.getPostData = [];
        $scope.getPromotedData = [];
        $scope.loadmore = false;
        $scope.nomoreFeed=false;
        $scope.contentLoaded=false;
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
                $scope.contentLoaded=true;
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
                var coordinate=Location.getPostionCordinate();
                $scope.geoGlobal = $scope.geoLoc;
                location_area1 = $scope.geoLoc;
                lat = coordinate.lat;
                lng = coordinate.lng;
                ViewService.getFilterLocation(lng, lat, page).then(function (response) {
                    $scope.getPostData = response.data.Posts;
                    $scope.getPromotedData = response.data.Promoted;
                })
            }
        }
        console.log("cordinate",Location.getPostionCordinate());
      /*  $scope.getGeoLoc = function () {
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
        }*/
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
        $scope.$on('$destroy', function() {
            $document.unbind('scroll');
        });
    }]);

