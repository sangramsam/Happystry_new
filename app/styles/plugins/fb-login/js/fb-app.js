var app = angular.module('plunker', ['ezfb', 'hljs', 'ngAutocomplete',
    'ngStorage', 'angular-svg-round-progressbar', 'timeIntervalServices', 'timeIntervalDirectives', 'ngRoute'])

        .config(function (ezfbProvider) {
            /**
             * Basic setup
             *
             * https://github.com/pc035860/angular-easyfb#configuration
             */
            ezfbProvider.setInitParams({
                appId: fb_appid
            });
        })

        .controller('MainCtrl', function ($scope, $rootScope, ezfb, $window, $location, $timeout, $http, $localStorage, $compile, roundProgressService, nowTime, getCollections) {
            // updateLoginStatus(updateApiMe);
            $localStorage.happystryUrl = $location.$$absUrl;
            $scope.result = '';
            $scope.options = {
                // country: 'ca',
                types: '(regions)'
            };
            $scope.details = '';
            $scope.SelectedCollection = 'All';
            $scope.SelectedHash = '';
            $scope.refreshPage = function () {
                $window.location.reload();
                $(window).scrollTop(0);
            }

            $scope.login = function () {
                /**
                 * Calling FB.login with required permissions specified
                 * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
                 */
                ezfb.login(function (res) {
                    /**
                     * no manual $scope.$apply, I got that handled
                     */
                    if (res.authResponse) {
                        // $window.location.href = "dashboard.html";

                        updateLoginStatus(updateApiMe);
                    }
                }, {scope: 'email,read_custom_friendlists'});
            };

            var countryCodeData = [];
            var selectedCountry;
            $scope.showSelCode = function (val) {
                val = val.replace(/[^\/\d]/g, '');
                selectedCountry = val;

                angular.forEach($scope.countryData, function (v, k) {
                    if (v.phonecode == selectedCountry) {
                        $scope.selCodeFlag = v.sxtenimgs;
                    }
                })
            }
            $http({
                method: 'GET',
                url: api_url + 'bookmarks/cntryflg',
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                $scope.countryData = response.data.code;
                countryCodeData = response.data.code;
                angular.forEach($scope.countryData, function (value, key) {
                    if (value.phonecode == $scope.countryCode) {
                        $scope.selCode = $scope.countryData[key].phonecode;
                    }
                });
            });

            $scope.loadFriends = function () {
                ezfb.loadFriends(function () {
                    loadFriends();
                });
            };
            $scope.logout = function () {
                /**
                 * Calling FB.logout
                 * https://developers.facebook.com/docs/reference/javascript/FB.logout
                 */
                ezfb.logout(function () {
                    updateLoginStatus(updateApiMe);
                });
            };

            $scope.share = function () {
                ezfb.ui(
                        {
                            method: 'feed',
                            name: 'angular-easyfb API demo',
                            picture: 'http://plnkr.co/img/plunker.png',
                            link: 'http://plnkr.co/edit/qclqht?p=preview',
                            description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' +
                                    ' Facebook integration in AngularJS made easy!' +
                                    ' Please try it and feel free to give feedbacks.'
                        },
                        function (res) {
                            // res: FB.ui response
                        }
                );
            };
            /**
             * For generating better looking JSON results
             */
            var autoToJSON = ['loginStatus', 'apiMe'];
            angular.forEach(autoToJSON, function (varName) {
                $scope.$watch(varName, function (val) {
                    $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
                }, true);
            });
            /**
             * Update loginStatus result
             */
            function updateLoginStatus(more) {
                ezfb.getLoginStatus(function (res) {
                    $scope.loginStatus = res;
                    (more || angular.noop)();
                });
            }

            /**
             * Update api('/me') result
             */

            function updateApiMe() {
                ezfb.api('/me', {
                    fields: 'name, gender'
                }, function (res) {
                    $scope.apiMe = res;
                    $http({
                        method: "post",
                        url: api_url + 'user/',
                        data: {
                            id: res.id,
                            name: res.name,
                            gender: res.gender,
                        },
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                    }).success(function (data) {
                        if (data.message == 'success') {
                            ezfb.api(
                                    "/me/friends",
                                    function (response) {
                                        $scope.friends = response.data;
                                        $scope.user_id = data.user_id;
                                        $http({
                                            method: "post",
                                            url: api_url + 'user/friends_list',
                                            data: {
                                                friends: $scope.friends,
                                                user_id: $scope.user_id,
                                            },
                                            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                                        }).success(function (data) {
                                            $rootScope.userData = data.user_welcome;
                                            if ($rootScope.userData) {
                                                jQuery.fancybox({
                                                    'href': '#contactInfo',
                                                    'closeBtn': false,
                                                    keys: {
                                                        close: null
                                                    }
                                                });
                                                angular.element('body').find('#contactInfo').parents('.fancybox-wrap .fancybox-outer').siblings('a').addClass('aa');
                                                return false;
                                            } else {

                                                var id = $localStorage.happystryUrl.substr($localStorage.happystryUrl.lastIndexOf('/') + 1);
                                                if ($localStorage.happystryUrl.indexOf('postdetails') > -1) {
                                                    $window.location.href = api_url + "#/postdetails/" + id;
                                                    $window.location.reload();
                                                } else if ($localStorage.happystryUrl.indexOf('profile') > -1) {
                                                    $window.location.href = api_url + "#/profile/" + id;
                                                    $window.location.reload();
                                                } else {
                                                    $window.location.href = api_url + "#/timeline";
                                                }
                                            }
                                        });
                                    });
                        } else {
                            if (data.type == 'user blocked') {
                                jQuery.fancybox({
                                    'href': '#user-blocked',
                                    'closeBtn': true,
                                    keys: {
                                        close: null
                                    }
                                });
                            }
                        }
                    });
                });
                return;
            }

            $scope.wrongNo = function (e) {
                angular.element(e.currentTarget);
                jQuery.fancybox({
                    'href': '#change-mob-no',
                    'closeBtn': false,
                    keys: {
                        close: null
                    }
                });
            };
            $scope.otpMobileVerf = function (e) {
                var umob = angular.element('#umob').val();
                var otpno = angular.element('#otp-no').val();
                var valid = 0;

                if (otpno === '') {
                    angular.element('#errorphone1').text('Please enter your otp');
                    angular.element('#otp-no').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#otp-no').val('');
                    angular.element('#otp-no').focus();
                    return false;
                } else {
                    angular.element("#errorphone1").text('');
                    angular.element('#otp-no').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    valid++;
                }

                if (valid == 1) {

                    var datau = {
                        otp_code: otpno,
                        mobile: umob
                    };
                    $http({
                        method: "put",
                        url: api_url + 'user/verifyotp',
                        data: datau,
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                    }).success(function (data) {
                        if (data.message == 'success') {
                            jQuery.fancybox({
                                'href': '#bookmark-popup',
                                'closeBtn': false,
                                keys: {
                                    close: null
                                }});
                        } else if (data.message == 'failed') {
                            if (data.type) {
                                angular.element('#errorphone1').text('Please enter valid otp');
                                angular.element('#otp-no').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                                angular.element('#otp-no').val('');
                                angular.element('#otp-no').focus();
                                return false;
                            }
                        }
                    });
                }
            };
            var favArr = [];
            $scope.isFavourate = function (e) {
                angular.element(e.currentTarget).toggleClass('isFav');
                var a = angular.element(e.currentTarget).next('h5').text();
                angular.element(e.currentTarget).parents('li').toggleClass('sel');


            };
            $scope.openVideo = function () {
                jQuery.fancybox({
                    'href': '#video'
                });
            };
            $scope.openVideo1 = function () {
                jQuery.fancybox({
                    'href': '#video1'
                });
            };
            $scope.openVideo2 = function () {
                jQuery.fancybox({
                    'href': '#video2'
                });
            };
            $scope.openVideo3 = function () {
                jQuery.fancybox({
                    'href': '#video3'
                });
            };
            $scope.openVideo4 = function () {
                jQuery.fancybox({
                    'href': '#video4'
                });
            };
            $scope.openVideo5 = function () {
                jQuery.fancybox({
                    'href': '#video5'
                });
            };
            $scope.openVideo6 = function () {
                jQuery.fancybox({
                    'href': '#video6'
                });
            };
            $scope.bookmarkPop = function (e) {
                var ab = angular.element('body').find(' #bookmark-popup ul li.sel h5').text();
                var selArray = angular.element('body').find(' #bookmark-popup ul li.sel');
                var collection = "";
                angular.forEach(selArray, function (value, key) {
                    var a = angular.element(value).find('h5').text();

                    if (key > 0) {
                        collection += ',';
                    }
                    collection += a;
                });
                $http({
                    method: "Post",
                    url: api_url + 'rewards/preCollection',
                    data: {
                        interest: collection
                    },
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                }).success(function (data) {
                    var id = $localStorage.happystryUrl.substr($localStorage.happystryUrl.lastIndexOf('/') + 1);
                    if ($localStorage.happystryUrl.indexOf('postdetails') > -1) {
                        $window.location.href = api_url + "#/postdetails/" + id;
                        $window.location.reload();
                    } else if ($localStorage.happystryUrl.indexOf('profile') > -1) {
                        $window.location.href = api_url + "#/profile/" + id;
                        $window.location.reload();
                    } else {
                        $window.location.href = api_url + "#/timeline";
                    }

                });

            }
            $scope.resend = function (umob) {
                var umcode = angular.element('#umcode').val();
                var umflag = angular.element('#umflag').val();
                var datau = {
                    code: umcode,
                    flag: umflag,
                    mobile: umob,
                    rechange: '1'
                };
                $http({
                    method: "put",
                    url: api_url + 'user',
                    data: datau,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                }).success(function (data) {
                    $rootScope.umobile = data.user_details[0].mobile;
                });
            };
            $scope.changeno = function () {
                var umobcode = $scope.selCode;
                var umob1 = angular.element('#mobile1').val();
                var valid = 0;
                var onlyNum = /^\d+$/;
                if (umobcode === undefined) {
                    angular.element('#errorphone2').text('Please select country code');
                    angular.element('#countrycode1').css('border-bottom', '1px solid #f00');
                    angular.element('#countrycode1').focus();
                    return false;
                } else {
                    angular.element("#errorphone2").text('');
                    angular.element('#countrycode1').css('border-bottom', '1px solid #d7e7ec');
                    valid++;
                }
                if (umob1 === '') {
                    angular.element('#errorphone2').text('Please enter the phone number');
                    angular.element('#mobile1').css('border-bottom', '1px solid #f00');
                    angular.element('#mobile1').focus();
                    return false;
                } else if (!onlyNum.test(umob1)) {
                    angular.element('#errorphone2').text('Please enter only numbers');
                    angular.element('#mobile1').css('border-bottom', '1px solid #f00');
                    angular.element('#mobile1').focus();
                    return false;

                } else {
                    angular.element("#errorphone2").text('');
                    angular.element('#mobile1').css('border-bottom', '1px solid #d7e7ec');
                    valid++;
                }
                if (valid == 2) {
                    var datau = {
                        code: umobcode,
                        flag: $scope.selCodeFlag,
                        mobile: umob1,
                        rechange: '1'
                    };
                    $http({
                        method: "put",
                        url: api_url + 'user',
                        data: datau,
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                    }).success(function (data) {
                        if (data.message == 'success') {
                            $rootScope.umobile = data.user_details[0].mobile;
                            jQuery.fancybox({
                                'href': '#otp',
                                'closeBtn': false,
                                keys: {
                                    close: null
                                }
                            });
                        } else if (data.user_type == 'mobile') {
                            angular.element('#errorphone2').text('Mobile Number Already Exists');
                            angular.element('#mobile1').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                            angular.element('#mobile1').focus();
                            return false;
                        }

                    });
                }
            };
            $scope.goToMobileVerf = function (e) {
                var umob = angular.element('#umobile').val();
                var umobcode = $scope.selCode;
                var uloc = (location_city != '') ? location_city : '';
                var location_lat = (location_city != '') ? lat : '';
                var location_lng = (location_city != '') ? lng : '';
                var uemail = angular.element('#uemail').val();

                var valid = 0;
                var onlyNum = /^\d+$/;
                var propEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

                if (uloc === '') {
                    angular.element('#errorloc').text('Please enter location').show();
                    angular.element('#uloc').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#uloc').focus();
                    return false;
                } else {
                    angular.element("#errorloc").text('').hide();
                    angular.element('#uloc').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    valid++;
                }
                if (umobcode === undefined) {
                    angular.element('#errorphone').text('Please select country code');
                    angular.element('#countrycode').css('border-bottom', '1px solid #f00');
                    angular.element('#countrycode').focus();
                    return false;
                } else {
                    angular.element("#errorphone").text('');
                    angular.element('#countrycode').css('border-bottom', '1px solid #d7e7ec');
                    valid++;
                }
                if (umob === '') {
                    angular.element('#errorphone').text('Please enter the phone number');
                    angular.element('#umobile').css('border-bottom', '1px solid #f00');
                    angular.element('#umobile').focus();
                    return false;
                } else if (!onlyNum.test(umob)) {
                    angular.element('#errorphone').text('Please enter only numbers');
                    angular.element('#umobile').css('border-bottom', '1px solid #f00');
                    angular.element('#umobile').focus();
                    return false;

                } else {
                    angular.element("#errorphone").text('');
                    angular.element('#umobile').css('border-bottom', '1px solid #d7e7ec');
                    valid++;
                }
                if (uemail === '') {
                    angular.element('#erroremail').text('Please enter email id');
                    angular.element('#uemail').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#uemail').focus();
                    return false;
                } else if (!propEmail.test(uemail)) {
                    angular.element('#erroremail').text('Please enter valid email id');
                    angular.element('#uemail').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#uemail').focus();
                    return false;
                } else {
                    angular.element("#erroremail").text('');
                    angular.element('#uemail').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    valid++;
                }


                var datau = {
                    location: uloc,
                    location_lat: location_lat,
                    location_lng: location_lng,
                    mobile: umob,
                    email: uemail,
                    code: umobcode,
                    flag: $scope.selCodeFlag,
                    rechange: '0'
                };

                if (valid == 4) {
                    $http({
                        method: "put",
                        url: api_url + 'user',
                        data: datau,
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                    }).success(function (data) {
                        if (data.message == 'success') {
                            $rootScope.umobile = data.user_details[0].mobile;
                            $rootScope.umcode = data.user_details[0].code;
                            $rootScope.umflag = data.user_details[0].flag;
                            jQuery.fancybox({
                                'href': '#otp',
                                'closeBtn': false,
                                keys: {
                                    close: null
                                }
                            });
                        } else if (data.message == 'failed') {
                            if (data.user_type == 'email') {
                                angular.element('#erroremail').text('Email Already Exists');
                                angular.element('#uemail').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                                angular.element('#uemail').focus();
                                angular.element('#uemail').val('');
                                return false;
                            } else if (data.user_type == 'mobile') {
                                angular.element('#errorphone').text('Mobile Number Already Exists');
                                angular.element('#umobile').css('border-bottom', '1px solid #f00');
                                angular.element('#umobile').focus();
                                angular.element('#umobile').val('');
                                return false;
                            }
                        }
                    });
                }
            };
            $scope.goBack = function () {
                jQuery.fancybox({
                    'href': '#otp',
                    'closeBtn': false,
                    keys: {
                        close: null
                    }
                });
            };
            $scope.submitSub = function () {
                var subEmail = angular.element("#subscribe").val();
                var valid = 0;
                var propEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                if (subEmail === '') {
                    angular.element('#error_email').text('Please enter email id').css('color', 'red').show();
                    angular.element("#subscribe").val('');
                    angular.element('#subscribe').focus();
                    return false;
                } else if (!propEmail.test(subEmail)) {
                    angular.element('#error_email').text('Please enter valid email id').css('color', 'red').show();
                    angular.element("#subscribe").val('');
                    angular.element('#subscribe').focus();
                    return false;
                } else {
                    angular.element("#error_email").text('');
                    valid++;
                }

                if (valid == 1) {
                    $http({
                        method: "post",
                        url: api_url + 'user/subscribe',
                        data: {
                            email: subEmail
                        },
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                    }).success(function (data) {
                        if (data.status) {
                            if (data.message == 'success') {
                                angular.element('#error_email').css('color', 'green');
                                angular.element('#error_email').text('Successfully subscribed').show();

                            } else {
                                angular.element('#error_email').text(data.type).css('color', 'green').show();
                            }
                        }
                    });
                }
                return false;
            };

            if ($location.$$absUrl === api_url + '#/timeline') {
                $window.location.href = api_url + "#/timeline";
            }
            document.getElementById('uloc').addEventListener('keypress', function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                }
            });
            $http({
                method: 'GET',
                url: api_url + "post/trendinghash",
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                $scope.getTrendingData = response.data.trending;
            });

            getCollections.getCollectionsData().then(function (response) {
                $scope.getCollectionData = response;
                $scope.SelectedCollection = 'All';
            });

            $scope.searchChash = function (collection) {
                var searchColl = collection.replace(/ /g, "_");
                $window.location.href = api_url + "#/search/collection/" + searchColl;
            };
            $scope.collectionFilter = function (coll_name) {
                $scope.SelectedCollection = coll_name;
                $scope.SelectedHash = '';
                resetProperty();
                $scope.getData(coll_name, '');
            };
            $scope.hashFilter = function (hash_name) {
                $scope.SelectedHash = hash_name;
                $scope.SelectedCollection = 'All';
                resetProperty();
                $scope.getData('All', hash_name);
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




            var page = 0;
            var scroll = true;

            function resetProperty() {
                page = 0;
                scroll = true;
                $scope.showNoPost = false;
                $scope.getPostData = [];
                $scope.getPromotedData = [];
                $scope.totalPosts = 0;
                $scope.postCount = 0;
                $('.fb-more').removeClass('fb-fixed');
                $scope.total = 25;
                $scope.propmotedLimit = 0;
                $scope.normalPostLimit = 0;
            }
            resetProperty();
            $scope.showNoPost = false;
            // $scope.loadmore = true;
            // $scope.loadmore = false;
            // $scope.footerShow = false;

            $scope.getData = function (searchColl, searchHash) {

                if ($scope.totalPosts != 0 && $scope.totalPosts + 1 >= $scope.postCount) {
                    $('.fb-more').removeClass('fb-fixed');
                    // $scope.footerShow = true;
                    return;
                }
                scroll = false;
                // $scope.loadmore = true;
                var apiUrl = api_url;
                if (searchHash != '') {
                    apiUrl += 'post/indexweb?hashtag=' + searchHash + '&';
                } else if (searchColl != 'All') {
                    apiUrl += 'post/indexweb?collection=' + searchColl + '&';
                } else {
                    apiUrl += 'post?';
                }
                apiUrl += 'page=' + page;
                $http({
                    method: 'GET',
                    url: apiUrl,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                }).then(function (response) {
                    // $scope.loadmore = false;
                    page = page + 10;
                    scroll = true;
                    $scope.postCount = response.data.allPosts.post_count;
                    if (response.data.allPosts.Promoted) {
                        $scope.normalPostLimit = $scope.total - $scope.getPromotedData.length - response.data.allPosts.Promoted.length;
                        $scope.propmotedLimit = $scope.total - $scope.normalPostLimit;
                        $scope.totalPosts = $scope.totalPosts + response.data.allPosts.Posts.length + response.data.allPosts.Promoted.length;
                    } else {
                        $scope.totalPosts = $scope.totalPosts + response.data.allPosts.Posts.length;
                    }
                    $scope.getPostData = ($scope.getPostData).concat(response.data.allPosts.Posts);

                    angular.forEach($scope.getPostData, function (v, k) {
                        var splitRowObject = v.location.split(',');
                        if (splitRowObject.length > 0)
                            $scope.getPostData[k].location = splitRowObject[0];
                    });
                    $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.allPosts.Promoted);

                    if ($scope.getPromotedData != undefined) {
                        angular.forEach($scope.getPromotedData, function (v, k) {
                            var splitRowObject = v.location.split(',');
                            if (splitRowObject.length > 0)
                                $scope.getPromotedData[k].location = splitRowObject[0];
                        });
                    }

                    if ($scope.getPostData != undefined) {
                        //from desc string taking #tags and inserting anchor tag dynamically
                        angular.forEach($scope.getPostData, function (value, key) {
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
                            if (value.description.indexOf("ng-href") < 0)
                                $scope.getPostData[key].description = hashData.join(' ');
                        });

                        getFeedData = $scope.getPostData;
                        angular.forEach($scope.getPromotedData, function (value, key) {
                            var hashData = [];
                            $scope.getPromotedData[key].limitDes = value.description;
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
                            if (value.description.indexOf("ng-href") < 0)
                                $scope.getPromotedData[key].description = hashData.join(' ');
                        });
                    }
                    /*if (window.location.href.indexOf('timeline') > -1 && ViewService.previousPost !== undefined) {
                     $rootScope.getPromotedData = ViewService.previouspromPost;
                     $rootScope.getPostData = ViewService.previousPost;
                     $scope.totalPosts = $rootScope.getPostData.length + $rootScope.getPromotedData.length;
                     }*/

                    $scope.refresh = function () {
                        angularGridInstance.postData.refresh();
                    };

                    //from desc string taking #tags and ins erting anchor tag dynamically
                    $rootScope.dataLoaded = true;
                    $scope.showNoPost = true;
                }, function errorCallback(response) {

                });
            };

            $rootScope.$on('$routeChangeStart', function (e, current, pre) {
                // $rootScope.currentPath = current.originalPath;
                var a = $location.absUrl();
                var newUrl = a.replace("home", "");
                $location.path($location.url(newUrl).hash());
                $window.location.reload();
            });



            if (window.location.href.indexOf("postdetails") > -1) {
                $window.location.href = api_url;
            }

            $scope.urlModification = function (post_id, obj) {
                var selectedObj = obj.target.parentNode.attributes;
                if (selectedObj.href && selectedObj.href.value) {
                    if (window.location.href.indexOf("postdetails") > -1) {
                        var v = selectedObj.href.value;
                        $window.location.href = api_url + v;
                    } else {
                        var v = selectedObj.href.value;
                        $window.location.href = api_url + v;
                    }
                }
            };

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

            // $scope.footerShow = true;

            angular.element($window).on('scroll', function () {
                var fixed = $(".discover-more-fixed").offset().top;
                // 315
                if ($(this).scrollTop() >= fixed) {
                    $('.header-new-home').addClass('header-up');
                    $('.first-filter').addClass('first-filter-fixed');
                    /*if ($scope.totalPosts + 1 < $scope.postCount) {
                     $('.fb-more').addClass('fb-fixed');
                     }*/
                    /* if ($scope.totalPosts < 25) {
                     $('.fb-more').addClass('fb-fixed');
                     }*/
                } else {
                    $('.header-new-home').removeClass('header-up');
                    $('.first-filter').removeClass('first-filter-fixed');
                    // $('.fb-more').removeClass('fb-fixed');
                }

                /* scroll to end */
                var footer_distance = 70;
                var document_height = $(document).height();

                var relative = $('.discover-more-relative').offset().top;

                if (($('.discover-more-relative').isOnScreen() == true || $(this).scrollTop() >= relative) && scroll == true && ($scope.totalPosts < $scope.total)) {
                    scroll = false;
                    if ($scope.SelectedCollection != 'All') {
                        $scope.getData($scope.SelectedCollection, '');
                    } else if ($scope.SelectedHash != '') {
                        $scope.getData('All', $scope.SelectedHash);
                    } else {
                        $scope.getData('All', '');
                    }
                }

                /*                if (($(window).scrollTop() + $(window).height() > document_height - footer_distance) && scroll == true && $scope.totalPosts < 25) {
                 scroll = false;
                 if ($scope.SelectedCollection != 'All') {
                 $scope.getData($scope.SelectedCollection, '');
                 } else if ($scope.SelectedHash != '') {
                 $scope.getData('All', $scope.SelectedHash);
                 } else {
                 $scope.getData('All', '');
                 }
                 }*/


                if ($('.discover-more-relative').isOnScreen() == true || $(".discover-more-fixed").isOnScreen() == true || $('footer').isOnScreen() == true) {
                    $('.fb-more').removeClass('fb-fixed');
                } else if ($(".discover-more-fixed").isOnScreen() == false) {
                    $('.fb-more').addClass('fb-fixed');
                }

                /* var relative = $('.discover-more-relative').offset().top;
                 console.log($(this).scrollTop(), relative);
                 if($scope.totalPosts>=25 || $(this).scrollTop() > relative ){
                 $('.fb-more').removeClass('fb-fixed');
                 $scope.footerShow = true;
                 }*/

            });

            /* angular.element(document.querySelector(".scroll-section")).bind("scroll", function() {
             var doc = angular.element(document.querySelector(".scroll-section"));
             var docContainer = angular.element(document.querySelector(".feed-body"));
             
             if ( doc.scrollTop() >= docContainer.height() - doc.scrollTop() && scroll == true){
             scroll = false;
             $scope.getData('All','');
             }
             
             });*/

            //http call for sending like
            $scope.sendLike = function (postid, event) {
                $scope.loggin_pop(event);
                return false;
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

            $scope.playVideo = function () {
                jQuery.fancybox({
                    'href': '#videoPop',
                    'closeBtn': true,
                    keys: {
                        close: null
                    }
                });
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

        });

app.directive('myPosts', function () {
    return {
        restrict: 'EA',
        templateUrl: '/home/posts',
        scope: false
    };
});


app.filter('timeago', function ($filter) {
    return function (input, p_allowFuture) {

        var substitute = function (stringOrFunction, number, strings) {
            var string = angular.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
            var value = (strings.numbers && strings.numbers[number]) || number;
            return string.replace(/%d/i, value);
        },
                nowTime = (new Date()).getTime(),
                date = (new Date(input)).getTime(),
                //refreshMillis= 6e4, //A minute
                allowFuture = p_allowFuture || false,
                strings = {
                    prefixAgo: '',
                    prefixFromNow: '',
                    suffixAgo: "",
                    suffixFromNow: "from now",
                    seconds: "Just now",
                    minute: "1 min",
                    minutes: "%d mins",
                    hour: "1 hr",
                    hours: "%d hrs",
                    day: "1 day",
                    days: "%d days",
                    month: "1 month",
                    months: "%d months",
                    year: "1 year",
                    years: "%d years",
                    decade: "1 decade",
                    decades: "%d decades",
                    century: "1 century",
                    centuries: "%d centuries"
                },
        dateDifference = nowTime - date,
                words,
                seconds = Math.abs(dateDifference) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365,
                decades = years / 10,
                centuries = decades / 10,
                separator = strings.wordSeparator === undefined ? " " : strings.wordSeparator,
                prefix = strings.prefixAgo,
                suffix = strings.suffixAgo;
        if (allowFuture) {
            if (dateDifference < 0) {
                prefix = strings.prefixFromNow;
                suffix = strings.suffixFromNow;
            }
        }

        words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
                seconds < 90 && substitute(strings.minute, 1, strings) ||
                minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
                minutes < 90 && substitute(strings.hour, 1, strings) ||
                hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
                hours < 42 && substitute(strings.day, 1, strings) ||
                days < 30 && substitute(strings.days, Math.round(days), strings) ||
                days < 45 && substitute(strings.month, 1, strings) ||
                days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
                years < 1.5 && substitute(strings.year, 1, strings) ||
                years < 10 && substitute(strings.years, Math.round(years), strings) ||
                decades < 1.5 && substitute(strings.decade, 1, strings) ||
                decades < 10 && substitute(strings.decades, Math.round(decades), strings) ||
                centuries < 1.5 && substitute(strings.century, 1, strings) ||
                substitute(strings.centuries, Math.round(centuries), strings);
        var post_year = $filter('date')(input, 'y');
        var curr_year = $filter('date')(nowTime, 'y');
        if (hours < 24) {
            prefix.replace(/ /g, '')
            words.replace(/ /g, '')
            suffix.replace(/ /g, '')
            return (prefix + ' ' + words + ' ' + suffix + ' ' + separator);
        }
//else if ((hours >= 24) && (hours < 48)){
//return 'Yesterday';
//}
        else if (post_year == curr_year) {
            var today = $filter('date')(input, 'd MMM');
            return today;
        } else {
            var today = $filter('date')(input, 'd MMM, y');
            return today;
        }
    };
});

app.factory('getCollections', function ($http) {
    return {
        getCollectionsData: function () {
            return $http({
                method: 'GET',
                url: api_url + 'collections',
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                return response.data.collections;
            });
        }
    }
});

app.directive('compile', ['$compile', function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                    function (scope) {
                        return scope.$eval(attrs.compile);
                    },
                    function (value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    }
            )
        };
    }]);