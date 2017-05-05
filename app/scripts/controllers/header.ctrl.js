angular.module('Happystry.controllers').controller('headerController', ['$scope','Settings', 'ezfb', '$rootScope', '$http', '$timeout', '$window', 'roundProgressService', '$compile', 'commonService', '$location', 'angularGridInstance', '$localStorage', 'dynamicNotifications',
    function ($scope,Settings, ezfb, $rootScope, $http, $timeout, $window, roundProgressService, $compile, commonService, $location, angularGridInstance, $localStorage, dynamicNotifications) {

        $scope.files = [];
        $scope.resultLength = '';
        $scope.result = '';
        $scope.options = {
            types: '(regions)'
        };

        function checkingLocation() {
            $scope.searchurl = window.location.href.indexOf("search") > -1;
            $scope.isBookmark = window.location.href.indexOf("bookmark") > -1;
            $scope.isDesc = window.location.href.indexOf("query") > -1;
            $scope.isCollction = window.location.href.indexOf("collection") > 1;
            $scope.isUser = window.location.href.indexOf("query/user") > -1;
            $scope.isPost = window.location.href.indexOf("query/post") > -1;
            $scope.isPostInner = window.location.href.indexOf("postdetails") > -1;
            $scope.isTimeline = window.location.href.indexOf("timeline") > -1;
            $scope.isProfile = window.location.href.indexOf('profile') > -1;
            $scope.isRewards = window.location.href.indexOf('rewards') > -1;
            $scope.isRewardInner = window.location.href.indexOf('rewardsdetails') > -1;
        }
        $scope.refreshtimePage = function () {
            checkingLocation();
            if ($scope.isTimeline) {
                $window.location.reload();
                $(window).scrollTop(0);
            }
        }
        $scope.details = '';
        var start_val = 0;
//        $rootScope.dataLoaded = false;
        $scope.checkPath = $location.$$url;
        $localStorage.happystryUrl = $location.$$absUrl;
        var postid = $location.$$absUrl.substr($location.$$absUrl.lastIndexOf('/') + 1);
        $scope.resetClose = function () {
            angular.element('typeahead').find('.ty-search').val('');
            angular.element('.reset_close').hide();
        };

        $http({
            method: 'GET',
            url: Settings.BASE_URL + 'user/verifycheck',
            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
        }).then(function successCallback(response) {
            checkingLocation();
            if (response.data.logged == false && !$scope.isProfile && !$scope.isTimeline && !$scope.isPostInner && !$scope.searchurl) {
                $scope.logged_res = true;
                window.location.href = Settings.BASE_URL + 'home';
            } else {
                if (response.data.user_details) {
                    $scope.userData = response.data.user_details;
                    $rootScope.umobile = response.data.user_details[0].mobile;
                    $rootScope.umcode = response.data.user_details[0].code;
                    $rootScope.umflag = response.data.user_details[0].flag;
                    $scope.ulocation = response.data.user_details[0].location;
                    $scope.uemail = response.data.user_details[0].email;
                    if (($rootScope.umobile == null || $rootScope.umobile == '') || ($scope.ulocation == null || $scope.ulocation == '') || ($scope.uemail == null || $scope.uemail == '')) {
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
                        jQuery.fancybox({
                            'href': '#otp',
                            'closeBtn': false,
                            keys: {
                                close: null
                            }
                        });
                    }
                }
                return false;
            }
        });
        dynamicNotifications.notifyNow();

        $http({
            method: 'GET',
            url: Settings.BASE_URL + 'bookmarks/cntryflg',
            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
        }).then(function successCallback(response) {
            $scope.countryData = response.data.code;
            countryCodeData = response.data.code;
            angular.forEach($scope.countryData, function (value, key) {
                if (value.phonecode == $scope.countryCode) {
                    $scope.selCode = $scope.countryData[key].phonecode;
                }
            });
        });
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
        $http({
            method: 'GET',
            url: Settings.BASE_URL + 'user',
            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
        }).then(function successCallback(response) {
            if (response.data.logged == false) {
                $scope.logged_res = true;
            } else {
                $scope.defaultLoc = response.data.profile.personal[0].current_location;
                var defaultLoc = response.data.profile.personal[0].current_location;
                $scope.getEditProfileData = response.data.profile.personal[0];
                $scope.getUserLat = response.data.profile.personal[0].location_lat;
                $scope.getUserLng = response.data.profile.personal[0].location_lng;
                $scope.businessEditData = response.data.profile.business[0];
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL + "user/leaderboard?lat=" + $scope.getUserLat + "&lng=" + $scope.getUserLng,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).then(function successCallback(response) {
                    start_val = 1;
                    $scope.rankingCount = response.data.leaderboard.ranking_count;
                    var getleaderDataLoc = response.data.leaderboard.location;
                    var getleaderDataLoc1 = response.data.leaderboard.ranking;
                    $scope.getleaderDataLoc = response.data.leaderboard.location;
                    $scope.allLocation = [];
                    angular.forEach(response.data.leaderboard.location, function (v, k) {
                        $scope.allLocation.push(v);
                    });
                    $scope.allLocation.push({'current_location': 'All'});
                    angular.forEach($scope.allLocation, function (v, k) {
                        if (v.current_location.indexOf($scope.defaultLoc) > -1) {
                            $scope.myselect = $scope.allLocation[k];
                        }
                    });
                    $scope.getleaderDataResult = response.data.leaderboard.ranking;
                }, function errorCallback(response) {});
            }
        }, function errorCallback(response) {});

        $scope.card = true;
        $scope.setLocation = function (val) {
            $scope.card = true;
            start_val = 1;
            if (val.current_location == 'All') {
                var allSel = 'All';
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL + "user/leaderboard?location=" + allSel,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).then(function successCallback(response) {
                    $scope.rankingCount = response.data.leaderboard.ranking_count;
                    $scope.getleaderDataResult = response.data.leaderboard.ranking;
                    $scope.resultLength = $scope.getleaderDataResult.length;
                }, function errorCallback(response) {});
            } else {
                $scope.getUserLat = val.location_lat;
                $scope.getUserLng = val.location_lng;
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL + "user/leaderboard?lat=" + $scope.getUserLat + "&lng=" + $scope.getUserLng,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).then(function successCallback(response) {
                    $scope.rankingCount = response.data.leaderboard.ranking_count;
                    $scope.getleaderDataResult = response.data.leaderboard.ranking;
                }, function errorCallback(response) {});
            }
        }

        //circular progress bar
        $scope.max = 100;
        $scope.offset = 0;
        $scope.timerCurrent = 0;
        $scope.uploadCurrent = 0;
        $scope.stroke = 2;
        $scope.radius = 17;
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
            var transform = ($scope.isSemi ? '' : 'translateY(-50%)') + 'translateX(-50%)';
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
        $scope.searchClick = function (event) {
            if (angular.element(event.currentTarget).hasClass('active')) {
                angular.element(event.currentTarget).removeClass('active');
            } else {
                angular.element(event.currentTarget).addClass('active');
            }
        };
        $scope.profileCLk = function (id) {
            $.fancybox.close('#leader-board');
            $location.path('/profile/' + id);
        }
        $scope.loadMore = function (event, myselect) {
            if (myselect.current_location == 'All') {
                $http.get(Settings.BASE_URL + 'user/leaderboard?location=All&startval=' + start_val, {
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).then(function (items) {
                    $scope.rankingCount = items.data.leaderboard.ranking_count;
                    var data = items.data.leaderboard.ranking;
                    if (start_val == 1) {
                        $scope.getleaderDataResult = data;
                    } else {
                        // Append the items to the list
                        $scope.nextItems = data;
                        $scope.getleaderDataResult = ($scope.getleaderDataResult).concat($scope.nextItems);
                    }
                    start_val += 10;
                });
            } else {
                $http.get(Settings.BASE_URL + "user/leaderboard?lat=" + myselect.location_lat + "&lng=" + myselect.location_lng + "&startval=" + start_val, {
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).then(function (items) {
                    $scope.rankingCount = items.data.leaderboard.ranking_count;
                    var data = items.data.leaderboard.ranking;
                    if (start_val == 1) {
                        $scope.getleaderDataResult = data;
                    } else {
                        // Append the items to the list
                        $scope.nextItems = data;
                        $scope.getleaderDataResult = ($scope.getleaderDataResult).concat($scope.nextItems);
                    }
                    start_val += 10;
                });
            }
        };

        $scope.appLogout = function () {
            $http({
                method: 'GET',
                url: Settings.BASE_URL + "user/logout",
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
            }).then(function successCallback(response) {

                $window.location.href = Settings.BASE_URL + 'home';
            });
        };

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
                    url: Settings.BASE_URL + 'user/verifyotp',
                    data: datau,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).success(function (data) {
                    if (data.message == 'success') {
                        $window.location.reload();
                    } else if (data.message == 'failed') {
                        angular.element('#errorphone1').text('Please enter valid otp');
                        angular.element('#otp-no').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                        angular.element('#otp-no').focus();
                        return false;
                    }
                });
            }
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
                url: Settings.BASE_URL + 'user',
                data: datau,
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
            }).success(function (data) {
                $rootScope.umobile = data.user_details[0].mobile;
            });
        };
        $scope.timeline = function () {
            window.location.href = Settings.BASE_URL + "#/timeline";
            window.location.reload();
        }
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
//            } else if ((umob1.length) < 10 || (umob1.length) > 15) {
//                angular.element('#errorphone2').text('Please enter 10 digit phone number');
//                angular.element('#mobile1').css('border-bottom', '1px solid #f00');
//                angular.element('#mobile1').focus();
//                return false;
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
                    url: Settings.BASE_URL + 'user',
                    data: datau,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
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
                        angular.element('#mobile1').css('border-bottom', '1px solid #f00');
                        angular.element('#mobile1').focus();
                        return false;
                    } else {
                        angular.element('#mobile1').css('border-bottom', '1px solid #d7e7ec');
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
                angular.element('#umobile').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                angular.element('#umobile').focus();
                return false;
            } else if (!onlyNum.test(umob)) {
                angular.element('#errorphone').text('Please enter only numbers');
                angular.element('#umobile').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                angular.element('#umobile').focus();
                return false;
//            } else if ((umob.length) < 10 || (umob.length) > 15) {
//                angular.element('#errorphone').text('Please enter 10 digit phone number');
//                angular.element('#umobile').parents('.fieldholder').css('border-bottom', '1px solid #f00');
//                angular.element('#umobile').focus();
//                return false;
            } else {
                angular.element("#errorphone").text('');
                angular.element('#umobile').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
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
                    url: Settings.BASE_URL + 'user',
                    data: datau,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
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
                            angular.element('#umobile').parents('.fieldholder').css('border-bottom', '1px solid #f00');
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



        // image upload option
        $scope.cropper = {};
        $scope.cropper.sourceImage = null;
        $scope.cropper.croppedImage = null;
        $scope.bounds = {};
        $scope.bounds.left = 0;
        $scope.bounds.right = 0;
        $scope.bounds.top = 0;
        $scope.bounds.bottom = 0;
        $rootScope.totalFilesAdded = 0;
        $rootScope.posting_img1 = '';
        $rootScope.posting_img2 = '';
        $rootScope.posting_img3 = '';
        $rootScope.posting_img4 = '';
        $rootScope.canvasCurrent = 0;
        $rootScope.isEditing = '';

        $scope.deletePostingImage = function (imgNum) {
            $rootScope.totalFilesAdded = $rootScope.totalFilesAdded - 1;
            if (imgNum == 1) {
                $rootScope.posting_img1 = '';
            } else if (imgNum == 2) {
                $rootScope.posting_img2 = '';
            } else if (imgNum == 3) {
                $rootScope.posting_img3 = '';
            } else if (imgNum == 4) {
                $rootScope.posting_img4 = '';
            }
            jQuery('.canvas_loadings').hide();
        }
        var api_Files = [];
        $scope.proceedToPost = function () {
            jQuery('.fountain_proceed').show();
            jQuery('.crop_continue').hide();
            var apiFiles = [];
            var temp = ['', $rootScope.posting_img1, $rootScope.posting_img2, $rootScope.posting_img3, $rootScope.posting_img4];
            temp.forEach(function (imgVal, i) {
                if (i == $rootScope.canvasCurrent) {
                    if (imgVal != '') {
                        apiFiles.push(imgVal);
                    }
                }
            });
            temp.forEach(function (imgVal, j) {
                if (j != $rootScope.canvasCurrent) {
                    if (imgVal != '') {
                        apiFiles.push(imgVal);
                    }
                }
            });
            function dataURLtoFile1(base64URLData, fileName) {
                var arr = base64URLData.split(',');
                var binary = atob(arr[1]);
                var len = binary.length;
                var buffer = new ArrayBuffer(len);
                var view = new Uint8Array(buffer);
                for (var i = 0; i < len; i++) {
                    view[i] = binary.charCodeAt(i);
                }
                var blob = new Blob([view], {type: 'image/jpeg'});
                blob.lastModifiedDate = new Date();
                blob.name = fileName;
                return blob;
            }
            $scope.model = {
               // post_id: ($route.current.loadedTemplateUrl === '/home/editpost') ? $route.current.params.q : 0
            };
            var formdata = new FormData();
            formdata.append('post', angular.toJson($scope.model));
            angular.forEach(apiFiles, function (value, key) {
                api_Files[key] = dataURLtoFile1(value, 'image' + key);
                formdata.append('files' + key, api_Files[key]);
            });
            return $http.post(Settings.BASE_URL + "post/imageUpload", formdata, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }).success(function (data) {
                jQuery('.fountain_proceed').hide();
                if (data.message == 'success') {
                    $scope.objs3files = data.image.post_image;
                    $scope.mains3files = data.image.post_image[0];
                    $scope.objs3files_thumb = data.image.post_thumbimage;
                    $scope.post_id = data.image.post_id;
                    $.fancybox.close();
                   /* if ($route.current.loadedTemplateUrl === '/home/editpost') {
                        $window.location.reload();
                    } else {
                        $location.path('/newpost');
                    }*/
                }
            });
        }
        // image upload option

        $scope.proceedTocancel = function () {
            jQuery('.fountain_proceed').hide();
           /* if ($route.current.loadedTemplateUrl === '/home/editpost') {
                $.fancybox.close();
            } else if ($route.current.loadedTemplateUrl === '/home/postcreation') {
                $.fancybox.close();
            } else {
                $.fancybox.close();
                $rootScope.totalFilesAdded = 0;
                $rootScope.posting_img1 = '';
                $rootScope.posting_img2 = '';
                $rootScope.posting_img3 = '';
                $rootScope.posting_img4 = '';
                $rootScope.canvasCurrent = 0;
                $rootScope.isEditing = '';
            }*/
        }
        $scope.getImage_data = function () {
            jQuery('.crop_continue').show();
            /*if ($route.current.loadedTemplateUrl === '/home/editpost') {
                $rootScope.isEditing = 1;
                $rootScope.doWatch($rootScope.posting_img1);
            }*/
            jQuery.fancybox({
                'href': '#myimage_uploader',
                'closeBtn': true,
                keys: {
                    close: null
                }
            });
        }

        //search page
        // document.getElementById('uloc').addEventListener('keypress', function (event) {
        //     if (event.keyCode == 13) {
        //         event.preventDefault();
        //     }
        // });

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

                    $localStorage.happystryUrl = $location.$$absUrl;
                    updateLoginStatus(updateApiMe);
                }
            }, {scope: 'email,user_likes'});
        };

        $scope.result = '';
        $scope.options = {
            // country: 'ca',
            types: '(cities)'
        };

        $scope.logout = function () {
            /**
             * Calling FB.logout
             * https://developers.facebook.com/docs/reference/javascript/FB.logout
             */
            ezfb.logout(function () {
                $window.location.href = Settings.BASE_URL + "home";
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
            ezfb.api('/me', function (res) {
                $scope.apiMe = res;
                $http({
                    method: "post",
                    url: Settings.BASE_URL + 'user/',
                    data: {
                        id: res.id,
                        name: res.name,
                        gender: res.gender,
                    },
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).success(function (data) {

                    if (data.message == 'success') {
                        ezfb.api(
                            "/me/friends",
                            function (response) {
                                $scope.friends = response.data;
                                $scope.user_id = data.user_id;
                                $http({
                                    method: "post",
                                    url: Settings.BASE_URL + 'user/friends_list',
                                    data: {
                                        friends: $scope.friends,
                                        user_id: $scope.user_id,
                                    },
                                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
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
                                            $window.location.href = Settings.BASE_URL + "#/postdetails/" + id;
                                            $window.location.reload();
                                        } else if ($localStorage.happystryUrl.indexOf('profile') > -1) {
                                            $window.location.href = Settings.BASE_URL + "#/profile/" + id;
                                            $window.location.reload();
                                        } else if ($localStorage.happystryUrl.indexOf("timeline") > -1) {
                                            $window.location.reload();
                                        } else {
                                            $window.location.href = Settings.BASE_URL + "#/timeline";
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
        }
    }]);