angular.module('Happystry.controllers').controller('userprofileController', ['$scope', 'profileService', '$http', 'Settings', 'ViewService', '$stateParams','$state', 'roundProgressService', '$location', 'likeFuntion', 'angularGridInstance', '$rootScope', '$window', '$document',
    function ($scope, profileService, $http, Settings, ViewService, $stateParams,$state, roundProgressService, $location, likeFuntion, angularGridInstance, $rootScope, $window, $document) {
        var userId = $stateParams.id;
        $rootScope.dataLoaded = false;
        $scope.contentLoaded=false;
        var page = 0;
        $scope.appsource = Settings.BASE_URL;
        console.log('state',$state);
        profileService.getProfileById(userId, page).then(function successCallback(response) {
            //$scope.resetClose();
            if (response.data.logged == false) {
                $scope.logged_res = true;
            }
            $scope.contentLoaded=true;
            console.log(response)
            angular.element('#autosugg').hide();
            $scope.getProfileDetails = response.data.userData;
            $scope.getProfileDetails.posts = response.data.userData.posts;
            $scope.totalPosts = ($scope.getProfileDetails.posts).length;
            $scope.postCount = $scope.getProfileDetails.post_count;
            angular.forEach($scope.getProfileDetails.posts, function (v, k) {
                var splitRowObject = v.location.split(',');
                if (splitRowObject.length > 0)
                    $scope.getProfileDetails.posts[k].location = splitRowObject[0];
            });
            $rootScope.dataLoaded = true;
        }, function errorCallback(response) {
            $rootScope.dataLoaded = true;
        });
        //http call for sending like
        $scope.sendLike = function (postid, event) {
            if ($scope.logged_res == true) {
                $scope.loggin_pop(event);
            } else {
                likeFuntion.sendLike(postid, event);
            }
        };
        //http call for sending like
        $scope.loggin_pop = function (e) {
            var path=window.location.href;
            localStorage.setItem("path",path);
            jQuery.fancybox({
                'href': '#loginPop',
                'closeBtn': true,
                keys: {
                    close: null
                }
            });
            e.preventDefault();
        }
        $scope.createUrl = function () {
            jQuery.fancybox({
                'href': '#create-url'
            });
        };
        // message button click routing
        $scope.getUserMsg = function () {
            $location.path('/messages/' + userId);

        };
        $scope.writeMsg = function (id) {
            $location.path('/messages/' + id);
        };
        $scope.searchChash = function (collection) {
            var searchColl = collection.replace(/ /g, "_");
            window.location.href = "#/search/collection/" + searchColl;
        };

        $scope.checkSpecial = function (string) {
            var specialChars = "<>@!#$%^&*()+[]{}?:;|'\"\\,/~`=";
            for (i = 0; i < specialChars.length; i++) {
                if (string.indexOf(specialChars[i]) > -1) {
                    return true;
                }
            }
            return false;
        }
        $scope.checkUrlAvail = function (val) {
            if (val == '' || val === undefined) {
                angular.element('#urlerror').text('Invalid profile URL.. Try something else!');
                angular.element('.uniq-url-hold').find('#u-url').css('border-bottom', '1px solid #f00');
                angular.element('#u-url').focus();
                return false;
            } else if ($scope.checkSpecial(val) === true) {
                angular.element('#urlerror').text('Invalid profile URL.. Try something else!');
                angular.element('.uniq-url-hold').find('#u-url').css('border-bottom', '1px solid #f00');
                angular.element('#u-url').focus();
                return false;
            } else if (val.length < 2) {
                angular.element('#urlerror').text('Invalid profile URL.. Please enter atleast 2 characters!');
                angular.element('.uniq-url-hold').find('#u-url').css('border-bottom', '1px solid #f00');
                angular.element('#u-url').focus();
                return false;
            } else if (val != '') {
                val = val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                angular.element("#urlerror").text('');
                angular.element('.uniq-url-hold').find('#u-url').css('border-bottom', '1px solid #d7e7ec');
                profileService.userHandler(val).then(function successCallback(response) {
                    if (response.data.message == 'success') {
                        $.fancybox.close("#create-url");
                        profileService.getProfileById(userId, page).then(function successCallback(response) {
                            //$scope.resetClose();
                            if (response.data.logged == false) {
                                $scope.logged_res = true;
                            }
                            console.log(response)
                            angular.element('#autosugg').hide();
                            $scope.getProfileDetails = response.data.userData;
                            $scope.getProfileDetails.posts = response.data.userData.posts;
                            $scope.totalPosts = ($scope.getProfileDetails.posts).length;
                            $scope.postCount = $scope.getProfileDetails.post_count;
                            angular.forEach($scope.getProfileDetails.posts, function (v, k) {
                                var splitRowObject = v.location.split(',');
                                if (splitRowObject.length > 0)
                                    $scope.getProfileDetails.posts[k].location = splitRowObject[0];
                            });
                            //from desc string taking #tags and inserting anchor tag dynamically
                            /*  angular.forEach($scope.getProfileDetails.posts, function (value, key) {
                             var hashData = [];
                             var val_desc = (value.description).split(" ");
                             angular.forEach(val_desc, function (valdesc, ky) {
                             var sds = valdesc.split("\n");
                             angular.forEach(sds, function (valsds, k) {
                             var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                             match = re.exec(valsds);
                             if (match) {
                             var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                             //                        $compile(res)($scope);
                             hashData.push(res);
                             } else {
                             hashData.push(valsds);
                             }
                             });
                             });

                             $scope.getProfileDetails.posts[key].description = hashData.join(' ');
                             });*/
                            //from desc string taking #tags and inserting anchor tag dynamically
                            $rootScope.dataLoaded = true;
                        }, function errorCallback(response) {
                            $rootScope.dataLoaded = true;
                        });
                    }
                    if (response.data.type == 'repeated') {
                        angular.element('#urlerror').text('Not available.. Try something else!');
                        angular.element('.uniq-url-hold').find('#u-url').css('border-bottom', '1px solid #f00');
                        angular.element('#u-url').focus();
                        return false;
                    }
                });
            }
        };
        angular.element('body').find('a div').removeClass('unfollow');
        $scope.userFollow = function (e, usrId) {
            if ($scope.logged_res == true) {
                $scope.loggin_pop(event);
            } else {
                var text = angular.element(e.currentTarget).find('a div').text();
                var followercount = angular.element(e.currentTarget).parents('body').find('#user-followers span').text();
                var followingcount = angular.element(e.currentTarget).parents('body').find('#user-following span').text();
                if (text == 'Follow') {
                  profileService.Follow(usrId).then(function successCallback(response) {
                        angular.element(e.currentTarget).find('a div').text('Following');
                        $scope.following = angular.element(e.currentTarget).find('a div').text('Following');
                        if ($scope.following) {
                            angular.element(e.currentTarget).find('a div').addClass('unfollow');
                        }
                      profileService.getProfileById(usrId,page).then(function successCallback(response) {
                            $scope.getProfileDetails.user_details[0].total_followers = response.data.userData.user_details[0].total_followers;
                            $scope.getProfileDetails.user_details[0].total_following = response.data.userData.user_details[0].total_following;

                        })
                    });
                } else {
                    profileService.unFollow().then(function successCallback(response) {
                        angular.element(e.currentTarget).find('a div').text('Follow');
                        if (angular.element(e.currentTarget).find('a div').text('Follow')) {
                            angular.element(e.currentTarget).find('a div').removeClass('unfollow');
                        }
                        profileService.getProfileById(usrId,page).then(function successCallback(response) {
                            $scope.getProfileDetails.user_details[0].total_followers = response.data.userData.user_details[0].total_followers;
                            $scope.getProfileDetails.user_details[0].total_following = response.data.userData.user_details[0].total_following;
                        })
                    });
                }
            }
        };

        $scope.getFollowers = function (userid) {
            $scope.loader = true;
           profileService.getFollowers(userid).then(function successCallback(response) {
                if (response.data.message == 'failed') {
                    $scope.getFollowersPopupData = [];
                } else {
                    $scope.getFollowersPopupData = response.data.followData;
                }
                setTimeout(function () {
                    $.fancybox("#followers");
                }, 500);
                $scope.loader = false;
            }, function errorCallback(response) {
                $scope.getFollowersPopupData = false;
                $scope.loader = false;
            });
        }
        $scope.closeFollowingPopup = function () {
            $.fancybox.close("#following");
        }
        $scope.getFollowing = function (userid) {
            $scope.loader = true;
           profileService.getFollowings(userid).then(function successCallback(response) {
                if (response.data.message == 'failed') {
                    $scope.getFollowingPopupData = [];
                } else {
                    $scope.getFollowingPopupData = response.data.followData;
                }

                setTimeout(function () {
                    $.fancybox("#following");
                }, 500);
                $scope.loader = false;
            });
        }

        $scope.uploadFile = function (files) {

            jQuery('.profile_cover_loader').show();
            var fd = new FormData();
            //Take the first selected file
            fd.append("cover_image", files[0]);
            var user_id = localStorage.getItem("user_id");
            console.log("image", fd);
            profileService.uploadCover(fd).then(function successCallback(response) {
                window.location.reload();
            });

        };

        //circular progress bar
        $scope.current = '';
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
                'left': '50%',
                'transform': transform,
                '-moz-transform': transform,
                '-webkit-transform': transform,
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
        $scope.loadMoreProfShots = function () {
            if ($scope.totalPosts < $scope.postCount) {
                page += 10;
                $scope.loader = true;
               profileService.getProfileById(userId,page).then(function successCallback(response) {
                    angular.element('#autosugg').hide();
                    var data = response.data.userData.posts;
                    $scope.getProfileDetails.posts = ($scope.getProfileDetails.posts).concat(data);
                    $scope.totalPosts += data.length;
                    $scope.loader = false;
                    angular.forEach($scope.getProfileDetails.posts, function (v, k) {
                        var splitRowObject = v.location.split(',');
                        if (splitRowObject.length > 0)
                            $scope.getProfileDetails.posts[k].location = splitRowObject[0];
                    });
                    //from desc string taking #tags and inserting anchor tag dynamically
                    //from desc string taking #tags and inserting anchor tag dynamically
                }, function errorCallback(response) {
                });

            }
        }
        angular.element($document).on('scroll', function () {
            var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());// calculate the percentage the user has scrolled down the page
            if (scrollPercent == 100) {
                $scope.loadMoreProfShots();
            }
        });
        $scope.$on('$destroy', function() {
            $document.unbind('scroll');
        });
        //dynamicNotifications.notifyNow();
    }]);