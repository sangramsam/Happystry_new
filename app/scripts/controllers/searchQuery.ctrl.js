
angular.module('Happystry.controllers').controller('searchQueryController', ['$scope','$rootScope','$window','$document','$stateParams','$state', '$http','ViewService','FilterService','profileService',
    function ($scope,$rootScope,$window,$document,$stateParams,$state, $http,ViewService,FilterService,profileService) {
        $scope.ddmodel = '';
        angular.element('.error_collection').hide();
        $scope.serseled = [];
        $scope.contentLoaded=false;
        $scope.colseled = [];
        $scope.forseled = [];
        $scope.locseled = [];
        var seaPage = 0;

        $scope.myInterval = 3000;
        $scope.limitDesc = 70;
        $scope.threeFilter = true;
        $scope.allFilter = false;
        $scope.active = 0;
        $scope.nearMe = false;
        $scope.nearMeColl = false;
        $scope.geoGlobal = '';
        var page = 0;
        var Cpage = 0;
        var Hpage = 0;
        var simiFeeds = [];
        $scope.isUser=false;
        $scope.isPost=false;
        $scope.dd = $stateParams.q;
        //console.log('$stateParams',$stateParams.q);
        $scope.page=0;
        $scope.fcClk = function ($event) {
            angular.element('.sub-menu').removeClass('ngshow');
            angular.element($event.currentTarget).next('.sub-menu').addClass('ngshow');
            $event.stopPropagation();
        }
        if($state.current.name.split('.')[1]==='Userquery'){
            angular.element('#autosugg').hide();
            $scope.isUser=true;
            FilterService.getSuggestFilerUser($scope.page,$scope.dd).then(function (response) {
                $scope.getPostUserData=response.data.suggestion.users;
                $scope.contentLoaded=true;

            });
        }
        if($state.current.name.split('.')[1]==='Postquery'){
            angular.element('#autosugg').hide();
            $scope.isPost=true;
            FilterService.getSuggestFilerPost($scope.page,$scope.dd).then(function (response) {
                $scope.getSuggPostData = response.data.suggestion.posts;
                $scope.contentLoaded=true;
            })
        }
        $scope.showSubmenu = function () {
            event.stopPropagation();
        }
        angular.element('.filter-more').hide();
        $scope.filterMore = function (e) {
            angular.element(e.currentTarget).parent().hide();
            $scope.allFilter = true;
            $scope.threeFilter = false;

        }
        angular.element('.page-title-holder').on('click', function () {
            event.stopPropagation();
        })
        angular.element('body').on('click', '#suggPost', function () {
            $scope.allFilter = false;
            $scope.threeFilter = true;
            angular.element('.filter-more').hide();
            angular.element('.filter-more').show();
        })

        $scope.cancelClkFlt = function (event) {
            angular.element(event.currentTarget).parents('.sub-menu.filter-show').removeClass('ngshow');
        };
        $scope.Formsearch = function () {
            var loc_id = angular.element('#loc').val();
            var col_chek = (angular.element('.collection-box').find('.checked')).length;
            var forsale = (angular.element('.forSale').find('.checked')).length;
            if (loc_id == '' && col_chek == 0 && forsale == 0) {
                alert('You will get only Not Sale Post');
            }
            var location = '';
            var location_lat = '';
            var location_lng = '';
            if (loc_id == '') {
            } else {
                location = (location_area1 != '') ? location_area1 + ',' + location_city1 : '';
                location_lat = (lat != '') ? lat : '';
                location_lng = (lng != '') ? lng : '';
            }
            var for_sale = (angular.element('.forSale').find('.checked').length != 0) ? 'Y' : 'N';

            var collections = '';
            $scope.selected = [];
            var selSearch = $stateParams.q;
            if ((angular.element('.collection-box').find('.checked')).length != 0) {
                angular.forEach(angular.element('.collection-box').find('.checked'), function (value, key) {
                    if (key > 0) {
                        collections += '^';
                    }
                    collections += angular.element(value).next('i').text();
                    $scope.selected[key] = angular.element(value).next('i').text();
                    $scope.colseled[key] = angular.element(value).next('i').text();
                });
            }

            $scope.model = {
                collections: collections,
                location: location,
                lat: location_lat,
                lng: location_lng,
                for_sale: for_sale
            };
            ($scope.selected).push(location);
            ($scope.locseled).push(location);
            ($scope.selected).push((for_sale != 'N') ? 'Sale' : "");
            ($scope.forseled).push((for_sale != 'N') ? 'Sale' : "");
            ($scope.serseled).push(selSearch);
            $scope.ser_worddd = $stateParams.q;
            $rootScope.apiFlrwrd = $scope.ser_worddd;
            $rootScope.apiFlrslt = $scope.selected;
            $rootScope.apiFlrmdl = $scope.model;
            seaPage = 0;
            angular.element('.sub-menu').removeClass('ngshow');
            $scope.apiFilter($scope.ser_worddd, $scope.selected, $scope.model);
        }
        $scope.apiFilter = function (selSearch, seleCted, modelVal) {

            $scope.ddmodel = $.extend([], seleCted);
            $scope.dd = '';
            $scope.ser_worddd = $stateParams.q;
            selSearch = $scope.ser_worddd;
            FilterService.getSuggestFilterPost2(seaPage,$scope.ser_worddd,modelVal).then(function (response) {
                    //angular.element('.sub-menu').removeClass('ngshow');
                if (response.data.status) {
                    if (response.data.suggestion.length != 0) {
                        //from desc string taking #tags and inserting anchor tag dynamically
                        angular.forEach(response.data.suggestion.posts, function (value, key) {
                            var hashData = [];
                            var val_desc = (value.description).split(" ");

                            response.data.suggestion.posts[key].description = hashData.join(' ');
                        });
                        if ((response.data.suggestion.posts).length != 0) {
                            $rootScope.sealoadmore = true;
                        } else {
                            $rootScope.sealoadmore = false;
                        }
                        if (seaPage == 0) {
                            $scope.getSuggPostData = response.data.suggestion.posts;
                        } else {
                            $scope.getSuggPostData = ($scope.getSuggPostData).concat(response.data.suggestion.posts);
                        }
                        angular.forEach($scope.getSuggPostData, function (v, k) {
                            var splitRowObject = v.location.split(',');
                            if (splitRowObject.length > 0)
                                $scope.getSuggPostData[k].location = splitRowObject[0];
                        });
//                                $scope.userpostLoad();
                    } else {
                        $rootScope.sealoadmore = false;
                        $scope.getSuggPostData = response.data.suggestion;
                    }
                }
            });
        };
        ViewService.getCollections().then(function (response) {
            $scope.getCollectionData = response.data.collections;
        }, function (response) {
        });


        //remove selected
        $scope.removeSelected = function (index) {
                if ($scope.isPost) {
                    var location = (location_area1 != '') ? location_area1 + ',' + location_city1 : '';
                    var location_lat = (location_city1 != '') ? lat : '';
                    var location_lng = (location_city1 != '') ? lng : '';
                    var for_sale = (angular.element('.forSale').find('.checked').length != 0) ? 'Y' : 'N';
                    var collections = '';
                    var selSearch = $stateParams.q;
                    if ($stateParams.q === index) {
                       $state.go('timeline.post');
                    } else {
                        $scope.splice = $scope.selected;
                        $scope.selected = [];
                        $scope.selected = $scope.splice;
                        $scope.selected.splice($scope.selected.indexOf(index), 1);
                        $scope.model = {
                            collections: collections,
                            location: location,
                            lat: location_lat,
                            lng: location_lng,
                            for_sale: for_sale
                        };
                        if ($scope.selected.length === 1) {
                            $state.go('timeline.post');
                        } else {
                            $scope.apiFilter(selSearch, $scope.selected, $scope.model);
                        }
                    }
                } else {
                    $state.go('timeline.post');
                }

        }

        //follow and unfollow
        $scope.userFollow = function (e, usrId) {
            if ($scope.logged_res === true) {
                $scope.loggin_pop(event);
            } else {
                var text = angular.element(e.currentTarget).find('a div').text();

                if (text === 'Follow') {
                    profileService.Follow(usrId).then(function (response) {
                        angular.element(e.currentTarget).find('a div').text('Unfollow');
                    });
                } else {
                    profileService.unFollow(usrId).then(function (response) {
                        angular.element(e.currentTarget).find('a div').text('Follow');
                    });
                }
            }
        };
        $scope.allUsers=function (word) {
            $state.go('timeline.Userquery', {q : word});

        }
        $scope.allPosts=function (word) {
            $state.go('timeline.Postquery', {q : word});
        }
        $scope.filLoc = 0;
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
//get location

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
                    $rootScope.location = geoLocation;
                    angular.element('#location').attr('placeholder', $rootScope.location);
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
    }]);



