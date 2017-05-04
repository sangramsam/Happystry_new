
angular.module('Happystry.directives').directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$emit(attr.onFinishRender);
            }
        }
    }
});
// mainController.run(['$rootScope','$location', '$routeParams', function($rootScope, $location, $routeParams) {
//     $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
//      $rootScope.currentPath = current.originalPath;
//     });
// }]);

angular.module('Happystry.controllers').controller('timelineController', ['Settings','$scope', '$http', 'getRewards', 'getCollections', 'roundProgressService', 'likeFuntion', '$compile', '$rootScope', 'angularGridInstance', '$location', '$window', 'ViewService', 'dynamicNotifications', 'postDataUpdate', '$localStorage',
        function (Settings,$scope, $http, getRewards, getCollections, roundProgressService, likeFuntion, $compile, $rootScope, angularGridInstance, $location, $window, ViewService, dynamicNotifications, postDataUpdate, $localStorage) {
            $rootScope.totalFilesAdded = 0;
            $rootScope.posting_img1 = '';
            $rootScope.posting_img2 = '';
            $rootScope.posting_img3 = '';
            $rootScope.posting_img4 = '';
            $rootScope.canvasCurrent = 0;
            $rootScope.isEditing = '';

            //$rootScope.apiFlrwrd = $route.current.params.q;
            $rootScope.apiFlrslt = [];
            $rootScope.apiFlrmdl = [];

            $rootScope.dataLoaded = false;

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
            $rootScope.getPostData = [];
            if ($)
                $scope.allusers = false;
            $scope.allposts = true;
            $scope.allUsers = function (searchVal) {
                angular.element('#autosugg').hide();
                window.location.href = "#/search/query/user/" + searchVal;
            };
            $scope.allPosts = function (searchVal) {
                angular.element('#autosugg').hide();
                window.location.href = "#/search/query/post/" + searchVal;
            };

//                $scope.check = {accepted: false};
            $scope.result = '';
            $scope.options = {
                // country: 'ca',
                types: '(regions)'
            };
            $scope.ddmodel = '';
            $scope.details = '';
            //$scope.nowTime = nowTime;
            $scope.isBookmark = window.location.href.indexOf("bookmark") > -1;
            $scope.isDesc = window.location.href.indexOf("query") > -1;
            $scope.isCollction = window.location.href.indexOf("collection") > 1;
            $scope.isUser = window.location.href.indexOf("query/user") > -1;
            $scope.isPost = window.location.href.indexOf("query/post") > -1;
            $scope.isPostInner = window.location.href.indexOf("postdetails") > -1;
            $scope.isTimeline = window.location.href.indexOf("timeline") > -1;

            //http call for rewards slider
//                $scope.limitSubtext = 86;
//                $scope.limitTitle = 32;
//                $scope.getRewardSlider = [];
//                getRewards.getRewardsData().then(function (response) {
//                    $scope.getRewardsData = response;
//                });
            //http call for rewards slider

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
                        ViewService.geo_location = geoLocation;
                        ViewService.geo_lat = geo_lat;
                        ViewService.geo_lng = geo_lng;
                        ViewService.locationauto = true;
                        $scope.geoLoc = geoLocation;
                        $scope.getGeoLat = geo_lat;
                        $scope.getGeoLng = geo_lng;
                    });
                $scope.timeline_post();
            }

            if (navigator.geolocation) {
//                    navigator.geolocation.getCurrentPosition(function (p) {
//                        var geocoder;
//                        geocoder = new google.maps.Geocoder();
//                        var latlng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
//                        geo_lat = p.coords.latitude;
//                        geo_lng = p.coords.longitude;
//                        geocoder.geocode(
//                                {'latLng': latlng},
//                                function (results, status) {
//                                    if (status == google.maps.GeocoderStatus.OK) {
//                                        if (results[0]) {
//                                            var add = results[0].formatted_address;
//                                            var value = add.split(",");
////                                            var geoLocation = '';
////                                            geoLocation = $scope.area.short_name + ',' + $scope.city.short_name;
////                                            ViewService.geo_location = geoLocation;
////                                            ViewService.geo_lat = geo_lat;
////                                            ViewService.geo_lng = geo_lng;
////                                            ViewService.locationauto = true;
////                                            $scope.geoLoc = geoLocation;
////                                            $scope.getGeoLat = geo_lat;
////                                            $scope.getGeoLng = geo_lng;
//                                            console.log(value);
//                                            count = value.length;
//                                            country = value[count - 1];
//                                            state = value[count - 2];
//                                            city = value[count - 3];
//                                            console.log(country);
//                                            console.log(state);
//                                            console.log(city);
//                                        } else {
//                                            alert("address not found");
//                                        }
//                                    } else {
//                                        alert("Geocoder failed due to: " + status);
//                                    }
//                                }
//                        );
//                    }, showError);
//                    if ($localStorage.geo_time) {
                navigator.geolocation.getCurrentPosition(PositionUpdate, showError, {maximumAge: 60000, timeout: 7000, enableHighAccuracy: true});
//                    }
            } else {
                $scope.timeline_post();
                console.log("Geolocation is not supported by this browser.");
            }
            function showError(error) {
                $scope.timeline_post();
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
                    $scope.timeline_post();
                }
            }
            $scope.removeNearMe = function () {
                $scope.geoGlobal = '';
                if ($scope.loc) {
                    $scope.dd = $route.current.params.q;
                    $scope.ser_worddd = $route.current.params.q;
                    $scope.dd = ($scope.dd).replace(/_/g, ' ');
                    window.location.href = "#/search/collection/" + $scope.dd;
                }
                $scope.timeline_post();
            }
            //http call for collections
            $scope.getCollectionsSlider = [];
            getCollections.getCollectionsData().then(function (response) {
                $scope.getCollectionData = response;
            });
            //http call for collections

            //http call for sending like
            $scope.sendLike = function (postid, event) {
                if ($scope.logged_res == true) {
                    $scope.loggin_pop(event);
                } else {
                    likeFuntion.sendLike(postid, event);
                }
            };
            //http call for rewards slider
            $scope.searchurl = window.location.href.indexOf("search") > -1;
            $http({
                method: 'GET',
                url: Settings.BASE_URL + "post/trendinghash",
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
            }).then(function successCallback(response) {

                $scope.isPostInner = window.location.href.indexOf("postdetails") > -1;
                $scope.searchurl = window.location.href.indexOf("search") > -1;
                $scope.isTimeline = window.location.href.indexOf("timeline") > -1;
                $scope.isProfile = window.location.href.indexOf('profile') > -1;
                if (response.data.logged == false && !$scope.isProfile && !$scope.isTimeline && !$scope.isPostInner && !$scope.searchurl) {
                    window.location.href = Settings.BASE_URL + 'home';
                    $scope.getTrendingData = response.data.trending;
                } else {
                    $scope.getTrendingData = response.data.trending;
                }
            });
            //intialized imageList
            $scope.isBookmark = window.location.href.indexOf("bookmark") > -1;
            if ($scope.isBookmark) {
                var book_page = 0;
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL + 'bookmarks?page=' + book_page,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).then(function successCallback(response) {
                    $scope.getBookmarkData = response.data.Bookmarks.Posts;
                    $scope.BookmarkDataCnt = response.data.Bookmarks.book_cnt;
                    $scope.totBkmrkCnt = ($scope.getBookmarkData).length;
                    $rootScope.bookLoaded = true;
                    angular.forEach($scope.getBookmarkData, function (v, k) {
                        var splitRowObject = v.location.split(',');
                        if (splitRowObject.length > 0)
                            $scope.getBookmarkData[k].location = splitRowObject[0];
                    });

                    angular.forEach($scope.getBookmarkData, function (value, key) {
                        var hashData = [];
                        var val_desc = (value.description).split(" ");
                        angular.forEach(val_desc, function (valdesc, ky) {
                            var sds = valdesc.split("\n");
                            angular.forEach(sds, function (valsds, k) {
                                var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                match = re.exec(valsds);
                                if (match) {
                                    var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                    $compile(res)($scope);
                                    hashData.push(res);
                                } else {
                                    hashData.push(valsds);
                                }
                            });
                        });

                        $scope.getBookmarkData[key].description = hashData.join(' ');
                    });
                    $scope.userpostLoad();
                });

            }

            $scope.searchChash = function (collection) {
                var searchColl = collection.replace(/ /g, "_");
                if ($scope.geoGlobal) {
                    window.location.href = "#/search/collection/" + searchColl + "/" + $scope.geoLoc;
                } else {
                    window.location.href = "#/search/collection/" + searchColl;
                }
//                    $location.path('/search/collection/').search({q: searchColl});

//                    $scope.timeline_post();
            };

            if ($scope.isPostInner) {
                var postId = $route.current.params.post_id;
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL + 'post/PostInner?post_id=' + postId + '&page=' + page,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).then(function successCallback(response) {
                    if (response.data.message == "failed") {
                        $window.location.href = "#/timeline";
                    } else {
//                        $scope.getCollections.getCollectionsData().then(function (response) {
//                        $scope.getCollectionData = response;
//                         });
                        $scope.share_link = Settings.BASE_URL + '#/postdetails/' + postId;
                        $scope.postdetails = response.data.post;
                        $scope.postdetailsDesc = $scope.postdetails.posts[0].description;
                        $scope.postdetailsImg = $scope.postdetails.posts[0].post_image[0];
                        $scope.postdetailsLocation = $scope.postdetails.posts[0].location;
                        var splitRowObject = $scope.postdetailsLocation.split(',');
                        if (splitRowObject.length > 0)
                            $scope.postdetailsLocation = splitRowObject[0];
                        //from desc string taking #tags and inserting anchor tag dynamically
                        var hashData = [];
                        var val_desc = ($scope.postdetails.posts[0].description).split(" ");
                        angular.forEach(val_desc, function (valdesc, ky) {
                            var sds = valdesc.split("\n");
                            angular.forEach(sds, function (valsds, k) {
                                var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                match = re.exec(valsds);
                                if (match) {
                                    var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                    $compile(res)($scope);
                                    hashData.push(res);
                                } else {
                                    hashData.push(valsds);
                                }
                            });
                        });
                        $scope.postdetails.posts[0].description = hashData.join(' ');


                        $scope.similar_feeds = response.data.post.similar_feeds;
                        simiFeeds = response.data.post.similar_feeds;
                        $scope.postSimiCount = $scope.postdetails.similar_count;
                        $scope.totalSimiPosts = response.data.post.similar_feeds.length;
                        angular.forEach($scope.similar_feeds, function (v, k) {
                            var splitRowObject = v.location.split(',');
                            if (splitRowObject.length > 0)
                                $scope.similar_feeds[k].location = splitRowObject[0];
                        });

                        //from desc string taking #tags and inserting anchor tag dynamically
                        angular.forEach($scope.similar_feeds, function (value, key) {
                            var hashData = [];
                            var val_desc = (value.description).split(" ");
                            angular.forEach(val_desc, function (valdesc, ky) {
                                var sds = valdesc.split("\n");
                                angular.forEach(sds, function (valsds, k) {
                                    var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                    match = re.exec(valsds);
                                    if (match) {
                                        var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                        $compile(res)($scope);
                                        hashData.push(res);
                                    } else {
                                        hashData.push(valsds);
                                    }
                                });
                            });
                            $scope.similar_feeds[key].description = hashData.join(' ');
                        });
                        //from desc string taking #tags and inserting anchor tag dynamically
                        $scope.shareUrl = Settings.BASE_URL + "#/postdetails/" + $scope.postdetails.posts[0].post_id;
                        $scope.checkcomments = response.data.post.comments.length === 0;
                        if ($scope.postdetails.posts[0].user_like === 0) {
                            angular.element('.sj_like1').find('a.like-unlike').addClass('like');
                        } else {
                            angular.element('.sj_like1').find('a.like-unlike').addClass('liked');
                        }
                        if ($scope.postdetails.posts[0].bookmark_flag === 1) {
                            $scope.bookmarked = true;
                        }
                    }
                }, function errorCallback(response) {
                });

            }

            $scope.timeline_post = function () {
                page = 0;
                //search page
				/*                    if (ViewService.page == undefined) {
				 ViewService.page = 0;
				 }
				 if(window.location.href.indexOf("timeline")>-1){
				 page = ViewService.page;
				 }else{
				 page = 0;
				 }*/
                var apiUrl = Settings.BASE_URL;
                if ($scope.searchurl) {
                    $scope.dd = $route.current.params.q;
                    $scope.ser_worddd = $route.current.params.q;
                    if (window.location.href.indexOf("hashtag") > 1) {
                        Hpage = 0;
                        $rootScope.Hpage_scope = 0;
                        apiUrl += 'post/indexweb?hashtag=' + $scope.dd + '&page=' + Hpage;
                        $scope.dd = '#' + $route.current.params.q;
                    } else if (window.location.href.indexOf("collection") > 1) {
                        Cpage = 0;
                        $rootScope.Cpage_scope = 0;
                        $scope.dd = ($scope.dd).replace(/_/g, ' ');
                        $scope.loc = $route.current.params.loc;
                        apiUrl += 'post/indexweb?collection=' + $scope.dd + '&page=' + Cpage;
                        if ($scope.loc) {
                            $scope.geoGlobal = $scope.geoLoc;
                            if (geo_lat != 0) {
                                apiUrl += '&geo_lat=' + geo_lat + '&geo_lon=' + geo_lng;
                            }
                        }
                    } else {
                        if ($scope.isUser) {
                            apiUrl += 'rewards/suggestfilter?query=' + $scope.ser_worddd + '&users=All&page=' + page;
                        } else if ($scope.isPost) {
                            apiUrl += 'rewards/suggestfilter?query=' + $scope.ser_worddd + '&posts=All&page=' + page;
                        } else {
                            /*$scope.resetClose();
                            apiUrl += 'post?page=' + page;*/
                        }
                    }
                } else {
                    /*$scope.resetClose();
                    apiUrl += 'post?page=' + page;*/
                }
                if ($scope.geoGlobal !== '' && geo_lat != 0 && $scope.getGeoLat != undefined) {
                    apiUrl += '&geo_lat=' + $scope.getGeoLat + '&geo_lon=' + $scope.getGeoLng;
                }
				/*if(window.location.href.indexOf('timeline')> -1 && ViewService.previousPost!==undefined){
				 $rootScope.getPromotedData = ViewService.previouspromPost;
				 $rootScope.getPostData = ViewService.previousPost;
				 }*/
//                    else{
                $http({
                    method: 'GET',
                    url: apiUrl,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}

                }).then(function (response) {
                    if ($scope.searchurl) {
                        if ($scope.isUser) {
                            $scope.getPostUserData = response.data.suggestion.users;
                            $rootScope.sealoadmore = true;
//                                $scope.userpostLoad();
                        } else if ($scope.isPost) {
                            if ((response.data.suggestion.posts).length != 0) {
                                $rootScope.sealoadmore = true;
                            } else {
                                $rootScope.sealoadmore = false;
                            }
                            $scope.getSuggPostData = response.data.suggestion.posts;

                            angular.forEach($scope.getSuggPostData, function (v, k) {
                                var splitRowObject = v.location.split(',');
                                if (splitRowObject.length > 0)
                                    $scope.getSuggPostData[k].location = splitRowObject[0];
                            });
                            //from desc string taking #tags and inserting anchor tag dynamically
                            angular.forEach(response.data.suggestion.posts, function (value, key) {
                                var hashData = [];
                                $scope.getSuggPostData[key].limitDes = value.description;
                                var val_desc = (value.description).split(" ");
                                angular.forEach(val_desc, function (valdesc, ky) {
                                    var sds = valdesc.split("\n");
                                    angular.forEach(sds, function (valsds, k) {
                                        var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                        match = re.exec(valsds);
                                        if (match) {
                                            var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                            $compile(res)($scope);
                                            hashData.push(res);
                                        } else {
                                            hashData.push(valsds);
                                        }
                                    });
                                });

                                response.data.suggestion.posts[key].description = hashData.join(' ');
                            });
//                                $scope.userpostLoad();
                        } else {
                            if (window.location.href.indexOf("hashtag") > 1) {
                                $rootScope.hashpostCount = response.data.allPosts.post_count;
                                if (response.data.allPosts.Promoted) {
                                    $rootScope.hashtotalPosts = response.data.allPosts.Posts.length + response.data.allPosts.Promoted.length;
                                } else {
                                    $rootScope.hashtotalPosts = response.data.allPosts.Posts.length;
                                }
                            } else {
                                $rootScope.collpostCount = response.data.allPosts.post_count;
                                if (response.data.allPosts.Promoted) {
                                    $rootScope.colltotalPosts = response.data.allPosts.Posts.length + response.data.allPosts.Promoted.length;
                                } else {
                                    $rootScope.colltotalPosts = response.data.allPosts.Posts.length;
                                }
                            }
                            $rootScope.getPostData = response.data.allPosts.Posts;
                            angular.forEach($rootScope.getPostData, function (v, k) {
                                var splitRowObject = v.location.split(',');
                                if (splitRowObject.length > 0)
                                    $rootScope.getPostData[k].location = splitRowObject[0];
                            });

                            $rootScope.getPromotedData = response.data.allPosts.Promoted;
                            angular.forEach($rootScope.getPromotedData, function (v, k) {
                                var splitRowObject = v.location.split(',');
                                if (splitRowObject.length > 0)
                                    $rootScope.getPromotedData[k].location = splitRowObject[0];
                            });

                            if ($rootScope.getPostData != undefined) {
                                //from desc string taking #tags and inserting anchor tag dynamically
                                angular.forEach($rootScope.getPostData, function (value, key) {
                                    var hashData = [];
//                            $rootScope.getPostData[key].limitDes = value.description;
                                    var val_desc = (value.description).split(" ");
                                    angular.forEach(val_desc, function (valdesc, ky) {
                                        var sds = valdesc.split("\n");
                                        angular.forEach(sds, function (valsds, k) {
                                            var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                            match = re.exec(valsds);
                                            if (match) {
                                                var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                                $compile(res)($scope);
                                                hashData.push(res);
                                            } else {
                                                hashData.push(valsds);
                                            }
                                        });
                                    });

                                    $rootScope.getPostData[key].description = hashData.join(' ');
                                });

                                getFeedData = $rootScope.getPostData;
                                angular.forEach($rootScope.getPromotedData, function (value, key) {
                                    var hashData = [];
                                    $rootScope.getPromotedData[key].limitDes = value.description;
                                    var val_desc = (value.description).split(" ");
                                    angular.forEach(val_desc, function (valdesc, ky) {
                                        var sds = valdesc.split("\n");
                                        angular.forEach(sds, function (valsds, k) {
                                            var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                            match = re.exec(valsds);
                                            if (match) {
                                                var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                                $compile(res)($scope);
                                                hashData.push(res);
                                            } else {
                                                hashData.push(valsds);
                                            }
                                        });
                                    });

                                    $rootScope.getPromotedData[key].description = hashData.join(' ');
                                });
                                page = 0;
                            }
							/*  var previousPost = ViewService.previousPost;
							 var previouspromPost = ViewService.previouspromPost;
							 if (previousPost != undefined) {
							 $rootScope.getPostData = previousPost;
							 $rootScope.getPromotedData = previouspromPost;
							 }
							 */

//                            $scope.getPrefferedData = response.data.allPosts.Preferred_posts;
//                            angular.forEach($rootScope.getPromotedData, function (v, k) {
//                                var splitRowObject = v.location.split(',');
//                                if (splitRowObject.length > 0)
//                                    $scope.getPrefferedData[k].location = splitRowObject[0];
//                            });
                        }
                    } else {
                        $scope.postCount = response.data.allPosts.post_count;
                        if (response.data.allPosts.Promoted) {
                            $scope.totalPosts = response.data.allPosts.Posts.length + response.data.allPosts.Promoted.length;
                        } else {
                            $scope.totalPosts = response.data.allPosts.Posts.length;
                        }
                        $rootScope.getPostData = response.data.allPosts.Posts;

                        angular.forEach($rootScope.getPostData, function (v, k) {
                            var splitRowObject = v.location.split(',');
                            if (splitRowObject.length > 0)
                                $rootScope.getPostData[k].location = splitRowObject[0];
                        });
                        $rootScope.getPromotedData = response.data.allPosts.Promoted;
                        angular.forEach($rootScope.getPromotedData, function (v, k) {
                            var splitRowObject = v.location.split(',');
                            if (splitRowObject.length > 0)
                                $rootScope.getPromotedData[k].location = splitRowObject[0];
                        });

                        if ($rootScope.getPostData != undefined) {
                            //from desc string taking #tags and inserting anchor tag dynamically
                            angular.forEach($rootScope.getPostData, function (value, key) {
                                var hashData = [];
//                            $rootScope.getPostData[key].limitDes = value.description;
                                var val_desc = (value.description).split(" ");
                                angular.forEach(val_desc, function (valdesc, ky) {
                                    var sds = valdesc.split("\n");
                                    angular.forEach(sds, function (valsds, k) {
                                        var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                        match = re.exec(valsds);
                                        if (match) {
                                            var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                            $compile(res)($scope);
                                            hashData.push(res);
                                        } else {
                                            hashData.push(valsds);
                                        }
                                    });
                                });

                                $rootScope.getPostData[key].description = hashData.join(' ');
                            });

                            getFeedData = $rootScope.getPostData;
                            angular.forEach($rootScope.getPromotedData, function (value, key) {
                                var hashData = [];
                                $rootScope.getPromotedData[key].limitDes = value.description;
                                var val_desc = (value.description).split(" ");
                                angular.forEach(val_desc, function (valdesc, ky) {
                                    var sds = valdesc.split("\n");
                                    angular.forEach(sds, function (valsds, k) {
                                        var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                        match = re.exec(valsds);
                                        if (match) {
                                            var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                            $compile(res)($scope);
                                            hashData.push(res);
                                        } else {
                                            hashData.push(valsds);
                                        }
                                    });
                                });

                                $rootScope.getPromotedData[key].description = hashData.join(' ');
                            });
                            page = 0;
                        }

                        if (window.location.href.indexOf('timeline') > -1 && ViewService.previousPost !== undefined) {
                            $rootScope.getPromotedData = ViewService.previouspromPost;
                            $rootScope.getPostData = ViewService.previousPost;
                            $scope.totalPosts = $rootScope.getPostData.length + $rootScope.getPromotedData.length;
                        }

						/*var previousPost = ViewService.previousPost;
						 var previouspromPost = ViewService.previouspromPost;
						 if (previousPost != undefined) {
						 $rootScope.getPostData = previousPost;
						 $rootScope.getPromotedData = previouspromPost;
						 }*/

//                        $scope.getPrefferedData = response.data.allPosts.Preferred_posts;
//                        angular.forEach($scope.getPrefferedData, function (v, k) {
//                            var splitRowObject = v.location.split(',');
//                            if (splitRowObject.length > 0)
//                                $scope.getPrefferedData[k].location = splitRowObject[0];
//                        });
                    }
                    $scope.refresh = function () {
                        angularGridInstance.postData.refresh();
                    };

                    //from desc string taking #tags and ins erting anchor tag dynamically
                    $rootScope.dataLoaded = true;
                }, function errorCallback(response) {
                });
            };

            $scope.searchClick = function (event) {
                if (angular.element(event.currentTarget).hasClass('active')) {
                    angular.element(event.currentTarget).removeClass('active');
                } else {
                    angular.element(event.currentTarget).addClass('active');
                }
            };
            $scope.cancelClkFlt = function (event) {
                angular.element(event.currentTarget).parents('.sub-menu.filter-show').removeClass('ngshow');
            };
            //circular progress bar
            $scope.max = 100;
            $scope.offset = 0;
            $scope.timerCurrent = 0;
            $scope.uploadCurrent = 0;
            $scope.stroke = 2;
            $scope.radius = 20;
            $scope.isSemi = false;
            $scope.rounded = false;
            $scope.responsive = false;
            $scope.clockwise = true;
            $scope.currentColor = '#f47354';
            $scope.bgColor = '#ccc';
            $scope.duration = 800;
            $scope.currentAnimation = 'easeOutCubic';
            $scope.animationDelay = 0;
            $scope.animations = [];
            angular.forEach(roundProgressService.animations, function (value, key) {
                $scope.animations.push(key);
            });
            $scope.getStyle = function () {
                var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';
                return {
                    'top': $scope.isSemi ? 'auto' : '50%',
                    // 'bottom': $scope.isSemi ? '5%' : 'auto',
                    'left': '50%',
                    'transform': transform,
                    '-moz-transform': transform,
                    '-webkit-transform': transform,
                    // 'font-size': $scope.radius/3.5 + 'px'
                    'font-size': 15 + 'px'
                };
            };
            $scope.getColor = function () {
                return $scope.gradient ? 'url(#gradient)' : $scope.currentColor;
            };
            $scope.showPreciseCurrent = function (amount) {
                $timeout(function () {
                    if (amount <= 0) {
                        $scope.preciseCurrent = $scope.current;
                    } else {
                        var math = $window.Math;
                        $scope.preciseCurrent = math.min(math.round(amount), $scope.max);
                    }
                });
            };
            var getPadded = function (val) {
                return val < 10 ? ('0' + val) : val;
            };
            //circular progress bar
            $scope.searchColl = function (event) {
                var a = angular.element(event.currentTarget).text();
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL + "post/indexweb?collection=" + a,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).then(function successCallback(response) {
                    $scope.getSearchData = response.data;
                }, function errorCallback(response) { });
            };
            //search page

            $scope.userFollow = function (e, usrId) {
                if ($scope.logged_res == true) {
                    $scope.loggin_pop(event);
                } else {
                    var text = angular.element(e.currentTarget).find('a div').text();
                    if (text == 'Follow') {
                        $http({
                            method: 'POST',
                            url: Settings.BASE_URL + "user/follow",
                            data: {
                                followed_id: usrId
                            },
                            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                        }).then(function successCallback(response) {
                            angular.element(e.currentTarget).find('a div').text('Unfollow');
                        });
                    } else {
                        $http({
                            method: 'POST',
                            url: Settings.BASE_URL + "user/unfollow",
                            data: {
                                followed_id: usrId
                            },
                            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                        }).then(function successCallback(response) {
                            angular.element(e.currentTarget).find('a div').text('Follow');
                        });
                    }
                }
            };
            angular.element('.error_collection').hide();
            $scope.serseled = [];
            $scope.colseled = [];
            $scope.forseled = [];
            $scope.locseled = [];
            var seaPage = 0;
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
                var selSearch = $route.current.params.q;
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
                $scope.ser_worddd = $route.current.params.q;
                $rootScope.apiFlrwrd = $scope.ser_worddd;
                $rootScope.apiFlrslt = $scope.selected;
                $rootScope.apiFlrmdl = $scope.model;
                seaPage = 0;
                $scope.apiFilter($scope.ser_worddd, $scope.selected, $scope.model);
            }
            $scope.apiFilter = function (selSearch, seleCted, modelVal) {

                $scope.ddmodel = $.extend([], seleCted);
                $scope.dd = '';
                $scope.ser_worddd = $route.current.params.q;
                selSearch = $scope.ser_worddd;

                $http.get(Settings.BASE_URL + "rewards/suggestfilter?query=" + $scope.ser_worddd + '&posts=All&page=' + seaPage, {
                    headers: {
                        'DATA': angular.toJson(modelVal),
                        'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                    }
                }).success(function (response) {
                    angular.element('.sub-menu').removeClass('ngshow');
                    if (response.status) {
                        if (response.suggestion.length != 0) {
                            //from desc string taking #tags and inserting anchor tag dynamically
                            angular.forEach(response.suggestion.posts, function (value, key) {
                                var hashData = [];
                                var val_desc = (value.description).split(" ");
                                angular.forEach(val_desc, function (valdesc, ky) {
                                    var sds = valdesc.split("\n");
                                    angular.forEach(sds, function (valsds, k) {
                                        var re = /(?:^|\W)#(\w+)(?!\w)/g, match1;
                                        match1 = re.exec(valsds);
                                        if (match1) {
                                            var res = match1[0].replace(match1[0], '<a ng-href="#/search/hashtag/' + match1[1] + '" >' + match1[0] + '</a>');
                                            $compile(res)($scope);
                                            hashData.push(res);
                                        } else {
                                            hashData.push(valsds);
                                        }
                                    });
                                });

                                response.suggestion.posts[key].description = hashData.join(' ');
                            });
                            if ((response.suggestion.posts).length != 0) {
                                $rootScope.sealoadmore = true;
                            } else {
                                $rootScope.sealoadmore = false;
                            }
                            if (seaPage == 0) {
                                $scope.getSuggPostData = response.suggestion.posts;
                            } else {
                                $scope.getSuggPostData = ($scope.getSuggPostData).concat(response.suggestion.posts);
                            }
                            angular.forEach($scope.getSuggPostData, function (v, k) {
                                var splitRowObject = v.location.split(',');
                                if (splitRowObject.length > 0)
                                    $scope.getSuggPostData[k].location = splitRowObject[0];
                            });
//                                $scope.userpostLoad();
                        } else {
                            $rootScope.sealoadmore = false;
                            $scope.getSuggPostData = response.suggestion;
                        }
                    }
                });
            };
            angular.element('.error_collection').hide();
            $scope.removeSelected = function (index) {

                if ($scope.searchurl) {
                    if ($scope.isPost) {
                        var location = (location_area1 != '') ? location_area1 + ',' + location_city1 : '';
                        var location_lat = (location_city1 != '') ? lat : '';
                        var location_lng = (location_city1 != '') ? lng : '';
                        var for_sale = (angular.element('.forSale').find('.checked').length != 0) ? 'Y' : 'N';
                        var collections = '';
                        var selSearch = $route.current.params.q;
                        if ($route.current.params.q == index) {
                            window.location.href = "#/timeline";
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
                                window.location.href = "#/timeline";
                            } else {
                                $scope.apiFilter(selSearch, $scope.selected, $scope.model);
                            }
                        }
                    } else {
                        window.location.href = "#/timeline";
                    }
                } else {
                    window.location.href = "#/timeline";
                }
            }
//header dropdown click
            $scope.fcClk = function ($event) {
                angular.element('.sub-menu').removeClass('ngshow');
                angular.element($event.currentTarget).next('.sub-menu').addClass('ngshow');
                $event.stopPropagation();
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

            $scope.loadmore = false;

            $scope.loadMoreShots = function () {
                if (($scope.totalPosts < $scope.postCount) || ($scope.colltotalPosts < $scope.collpostCount) || ($rootScope.hashtotalPosts < $rootScope.hashpostCount)) {
                    ViewService.stopApiCall = false;
                    if (ViewService.page == undefined) {
                        ViewService.page = 0;
                    }

                    $scope.searchurl = window.location.href.indexOf("search") > -1;
                    $scope.isUser = window.location.href.indexOf("query/user") > -1;
                    $scope.isPost = window.location.href.indexOf("query/post") > -1;
                    if (window.location.href.indexOf('timeline') > -1) {
                        page = ViewService.page;
                    }
                    page += 10;
                    var lm_apiUrl = Settings.BASE_URL;
                    $scope.loadmore = true;
                    if ($scope.searchurl) {
                        $scope.dd = $route.current.params.q;
                        $scope.ser_worddd = $route.current.params.q;
                        if (window.location.href.indexOf("hashtag") > 1) {
                            Hpage = $rootScope.Hpage_scope;
                            Hpage += 10;
                            $rootScope.Hpage_scope = Hpage;
                            lm_apiUrl += 'post/indexweb?hashtag=' + $scope.dd + '&page=' + Hpage;
                            $scope.dd = '#' + $route.current.params.q;
                        } else if (window.location.href.indexOf("collection") > 1) {
                            Cpage = $rootScope.Cpage_scope;
                            Cpage += 10;
                            $rootScope.Cpage_scope = Cpage;
                            $scope.dd = ($scope.dd).replace(/_/g, ' ');
                            $scope.loc = $route.current.params.loc;
                            lm_apiUrl += 'post/indexweb?collection=' + $scope.dd + '&page=' + Cpage;
                            if ($scope.loc) {
                                $scope.geoGlobal = $scope.geoLoc;
                                if (geo_lat != 0) {
                                    lm_apiUrl += '&geo_lat=' + geo_lat + '&geo_lon=' + geo_lng;
                                }
                            }
                        } else {
                            if ($scope.isUser) {
                                lm_apiUrl += 'rewards/?query=' + $scope.ser_worddd + '&users=All&page=' + page;
                            } else if ($scope.isPost) {
                                lm_apiUrl += 'rewards/suggestfilter?query=' + $scope.ser_worddd + '&posts=All&page=' + page;
                            } else {
                                lm_apiUrl += 'post?page=' + page;
                            }
                        }
                    } else {
                        lm_apiUrl += 'post?page=' + page;
                    }
                    if ($scope.geoGlobal !== '' && geo_lat != 0 && $scope.getGeoLat != undefined) {
                        lm_apiUrl += '&geo_lat=' + $scope.getGeoLat + '&geo_lon=' + $scope.getGeoLng;
                    }
                    $http({
                        method: 'GET',
                        url: lm_apiUrl,
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                    }).then(function successCallback(response) {
                        var data = response.data.allPosts.Posts;
                        var data1 = response.data.allPosts.Promoted;
                        ViewService.stopApiCall = true;

                        //from desc string taking #tags and inserting anchor tag dynamically
                        angular.forEach(data, function (v, k) {
                            var splitRowObject = v.location.split(',');
                            if (splitRowObject.length > 0)
                                data[k].location = splitRowObject[0];
                        });
                        angular.forEach(data, function (value, key) {
                            var hashData = [];
                            var val_desc = (value.description).split(" ");
                            angular.forEach(val_desc, function (valdesc, ky) {
                                var sds = valdesc.split("\n");
                                angular.forEach(sds, function (valsds, k) {
                                    var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                    match = re.exec(valsds);
                                    if (match) {
                                        var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                        $compile(res)($scope);
                                        hashData.push(res);
                                    } else {
                                        hashData.push(valsds);
                                    }
                                });
                            });

                            data[key].description = hashData.join(' ');
                        });

                        $rootScope.getPostData = ($rootScope.getPostData).concat(data);

                        if (window.location.href.indexOf('timeline') > -1) {
                            ViewService.previousPost = $rootScope.getPostData;
                            ViewService.page = page;
                        }

                        if (data1) {
                            angular.forEach(data1, function (v, k) {
                                var splitRowObject = v.location.split(',');
                                if (splitRowObject.length > 0)
                                    data1[k].location = splitRowObject[0];
                            });
                            angular.forEach(data1, function (value, key) {
                                var hashData = [];
                                $rootScope.getPromotedData[key].limitDes = value.description;
                                var val_desc = (value.description).split(" ");
                                angular.forEach(val_desc, function (valdesc, ky) {
                                    var sds = valdesc.split("\n");
                                    angular.forEach(sds, function (valsds, k) {
                                        var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                        match = re.exec(valsds);
                                        if (match) {
                                            var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                            $compile(res)($scope);
                                            hashData.push(res);
                                        } else {
                                            hashData.push(valsds);
                                        }
                                    });
                                });

                                data1[key].description = hashData.join(' ');
                            });
                            $rootScope.getPromotedData = ($rootScope.getPromotedData).concat(data1);
                            if (window.location.href.indexOf('timeline') > -1) {
                                ViewService.previouspromPost = $rootScope.getPromotedData;
                            }
                            $scope.totalPosts += data.length + data1.length;
                            if (window.location.href.indexOf("hashtag") > 1) {
                                $rootScope.hashtotalPosts += data.length + data1.length;
                            } else {
                                $rootScope.colltotalPosts += data.length + data1.length;
                            }
                        } else {
                            $scope.totalPosts += data.length;
                            if (window.location.href.indexOf("hashtag") > 1) {
                                $rootScope.hashtotalPosts += data.length;
                            } else {
                                $rootScope.colltotalPosts += data.length;
                            }
                        }

                        $scope.loadmore = false;

                        getFeedData = $rootScope.getPostData;
//                            $rootScope.$apply();
                    });
                }
            }

            $scope.loadMoreRelShots = function () {
                if ($scope.totalSimiPosts < $scope.postSimiCount) {
                    ViewService.stopApiCall = false;
                    page += 10;
                    var pd_apiUrl = Settings.BASE_URL;

                    if ($scope.isPostInner) {
                        var postid = $route.current.params.post_id;
                        pd_apiUrl += 'post/PostInner?post_id=' + postid + '&page=' + page;
                    }
                    $scope.loadmore = true;
                    $http({
                        method: 'GET',
                        url: pd_apiUrl,
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                    }).then(function successCallback(response) {
                        if (response.data.message == "failed") {
                            $window.location.href = "#/timeline";
                        } else {
                            ViewService.stopApiCall = true;
                            var data = response.data.post.similar_feeds;

                            angular.forEach(data, function (v, k) {
                                var splitRowObject = v.location.split(',');
                                if (splitRowObject.length > 0)
                                    data[k].location = splitRowObject[0];
                            });
                            //from desc string taking #tags and inserting anchor tag dynamically
                            angular.forEach(data, function (value, key) {
                                var hashData = [];
                                var val_desc = (value.description).split(" ");
                                angular.forEach(val_desc, function (valdesc, ky) {
                                    var sds = valdesc.split("\n");
                                    angular.forEach(sds, function (valsds, k) {
                                        var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                        match = re.exec(valsds);
                                        if (match) {
                                            var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                            $compile(res)($scope);
                                            hashData.push(res);
                                        } else {
                                            hashData.push(valsds);
                                        }
                                    });
                                });
                                data[key].description = hashData.join(' ');
                            });
                            $scope.similar_feeds = ($scope.similar_feeds).concat(data);
                            $scope.totalSimiPosts += data.length;
                            //from desc string taking #tags and inserting anchor tag dynamically

                            $scope.loadmore = false;
                        }
                    }, function errorCallback(response) {
                    });
                }
            }

            $scope.loadMoreBookShots = function () {
                if ($scope.totBkmrkCnt < $scope.BookmarkDataCnt) {
                    ViewService.stopApiCall = false;
                    book_page += 10;
                    $http({
                        method: 'GET',
                        url: Settings.BASE_URL + 'bookmarks?page=' + book_page,
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                    }).then(function successCallback(response) {

                        ViewService.stopApiCall = true;
                        var bookmarkData = response.data.Bookmarks.Posts;
                        angular.forEach(bookmarkData, function (v, k) {
                            var splitRowObject = v.location.split(',');
                            if (splitRowObject.length > 0)
                                bookmarkData[k].location = splitRowObject[0];
                        });
                        angular.forEach(bookmarkData, function (value, key) {
                            var hashData = [];
                            var val_desc = (value.description).split(" ");
                            angular.forEach(val_desc, function (valdesc, ky) {
                                var sds = valdesc.split("\n");
                                angular.forEach(sds, function (valsds, k) {
                                    var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                                    match = re.exec(valsds);
                                    if (match) {
                                        var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                        $compile(res)($scope);
                                        hashData.push(res);
                                    } else {
                                        hashData.push(valsds);
                                    }
                                });
                            });

                            bookmarkData[key].description = hashData.join(' ');
                        });
                        $scope.totBkmrkCnt += bookmarkData.length;
                        $scope.getBookmarkData = $scope.getBookmarkData.concat(bookmarkData);
                        $rootScope.bookLoaded = false;
                        $scope.userpostLoad();

                    });
                }
            }
            $scope.userpostLoad = function () {
                $scope.isBookmark = window.location.href.indexOf("bookmark") > -1;
                $scope.isUser = window.location.href.indexOf("query/user") > -1;
                $scope.isPost = window.location.href.indexOf("query/post") > -1;
                if ($scope.isUser || $scope.isPost) {
                    if ($rootScope.sealoadmore == true) {
                        seaPage += 10;
                        $scope.apiFilter($rootScope.apiFlrwrd, $rootScope.apiFlrslt, $rootScope.apiFlrmdl);
                    }
                } else if ($scope.isBookmark) {
                    if ($scope.totBkmrkCnt < $scope.BookmarkDataCnt) {
                        $scope.isTimeline = false;
                        $scope.isCollction = false;
                        $scope.loadMoreBookShots();
                    }
                }
            }
            angular.element($window).on('scroll', function () {

                $scope.isBookmark = window.location.href.indexOf("bookmark") > -1;
                $scope.isCollction = window.location.href.indexOf("collection") > 1;
                $scope.isHash = window.location.href.indexOf("hashtag") > 1;
                $scope.isPost = window.location.href.indexOf("query/post") > -1;
                $scope.isPostInner = window.location.href.indexOf("postdetails") > -1;
                $scope.isTimeline = window.location.href.indexOf("timeline") > -1;
                $scope.isUser = window.location.href.indexOf("query/user") > -1;
                $scope.isPost = window.location.href.indexOf("query/post") > -1;


                var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());// calculate the percentage the user has scrolled down the page
                if (window.location.href.indexOf("timeline") > -1 && ViewService.scrollPosition != undefined) {
//                        return;
                    ViewService.scrollPosition = $window.scrollY;
                }

                var footer_distance = 80;
                var document_height = $(document).height();
                var relative = $(".loadmore-relative").offset().top;
                var totalScroll = ($(window).scrollTop() + $(window).height()) > (document_height - footer_distance);

                // if ($(window).scrollTop() + $(window).height() > document_height - footer_distance && ViewService.stopApiCall != false) {
                if ((totalScroll || ($(window).scrollTop() > relative)) && ViewService.stopApiCall != false) {
//                    if (scrollPercent == 100 && ViewService.stopApiCall != false) {
                    if ($scope.isPostInner) {
                        var postid = $route.current.params.post_id;
                        if (postid) {
                            if ($scope.totalSimiPosts < $scope.postSimiCount) {
                                $scope.loadMoreRelShots();
                            }
                        } else {
                            $scope.isPostInner = false;
                        }
                    } else if ($scope.isTimeline) {
                        if ($scope.totalPosts < $scope.postCount) {
                            $scope.loadMoreShots();
                        }
                    } else if ($scope.isCollction) {
                        if ($rootScope.colltotalPosts < $rootScope.collpostCount) {
                            $scope.totalPosts = 0;
                            $scope.postCount = 0;
                            $scope.loadMoreShots();
                        }
                    } else if ($scope.isHash) {
                        if ($rootScope.hashtotalPosts < $rootScope.hashpostCount) {
                            $scope.totalPosts = 0;
                            $scope.postCount = 0;
                            $scope.loadMoreShots();
                        }
                    }
                }
            });

            $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                if (window.location.href.indexOf("timeline") > -1) {
                    if (ViewService.scrollPosition != undefined) {
                        $(window).scrollTop(ViewService.scrollPosition);
                        $timeout(function () {
                            ViewService.scrollPosition = undefined;
                        });
                    }
                }
            });
            $scope.$on('$routeChangeStart', function () {
                if (window.location.href.indexOf('timeline') > -1 && $window.scrollY > 0) {
                    ViewService.scrollPosition = $window.scrollY;
                }
            });
            dynamicNotifications.notifyNow();
        }]);

angular.module('Happystry').filter('removeEmptyString', function () {
    return function (input) {
        var newInput = [];
        angular.forEach(input, function (item) {
            if (item != "")
                newInput.push(item);
        });
        return newInput;
    };
});
