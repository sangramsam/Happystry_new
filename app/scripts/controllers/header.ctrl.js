angular.module('Happystry.controllers').controller('headerController', ['$scope','ImageUpload','$stateParams','$state', 'logOut','notify', 'UserVerify', 'Settings', 'ezfb', '$rootScope', '$http', '$timeout', '$window', 'roundProgressService', '$compile', 'commonService', '$location', 'angularGridInstance', '$localStorage', 'dynamicNotifications','OTP', 'OTPVerify', 'CountryCode', 'FacebookService', 'LoginService',
    function ($scope,ImageUpload,$stateParams,$state, logOut,notify, UserVerify, Settings, ezfb, $rootScope, $http, $timeout, $window, roundProgressService, $compile, commonService, $location, angularGridInstance, $localStorage, dynamicNotifications,OTP, OTPVerify, CountryCode, FacebookService, LoginService) {
        $rootScope.logged_res = false;
        $scope.otpNo='';
        $rootScope.loggin_pop = function (e) {
            jQuery.fancybox({
                'href': '#loginPop',
                'closeBtn': true,
                keys: {
                    close: null
                }
            });
            e.preventDefault();
        }
        CountryCode.getCountryCode().then(function (resposne) {
            /// console.log("country code", resposne);
            $rootScope.countryData = resposne.data;
        })
        function verifyUser() {
            UserVerify.verifyUser().then(function (res) {
                console.log(res);
                if (res.data.logged === false) {
                    $rootScope.logged_res = true;
                } else {
                    if (res.data.user_details) {
                        $rootScope.userData = res.data.user_details;
                        $rootScope.umobile = res.data.user_details[0].mobile;
                        $rootScope.umcode = res.data.user_details[0].code;
                        $rootScope.umflag = res.data.user_details[0].flag;
                        $rootScope.ulocation = res.data.user_details[0].location;
                        $rootScope.uemail = res.data.user_details[0].email;
                        if (($rootScope.umobile == null || $rootScope.umobile == '') || ($rootScope.ulocation == null || $rootScope.ulocation == '') || ($rootScope.uemail == null || $rootScope.uemail == '')) {
                            jQuery.fancybox({
                                'href': '#contactInfo',
                                'closeBtn': false,
                                keys: {
                                    close: null
                                }
                            });
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
                }


            })
        }
        verifyUser();
        //get userDetail
        UserVerify.userData().then(function (response) {
            if (response.data.logged === false) {
                $rootScope.logged_res = true;
            } else {
                if (response.data.profile) {
                    $scope.defaultLoc = response.data.profile.personal[0].current_location;
                    $scope.getEditProfileData = response.data.profile.personal[0];
                    $scope.getUserLat = response.data.profile.personal[0].location_lat;
                    $scope.getUserLng = response.data.profile.personal[0].location_lng;
                    $scope.businessEditData = response.data.profile.business[0];
                    UserVerify.userLeaderboard($scope.getUserLat,$scope.getUserLng).then(function successCallback(response) {
                        start_val = 1;
                        console.log("leader",response);
                        $scope.rankingCount = response.data.leaderboard.ranking_count;
                        var getleaderDataLoc = response.data.leaderboard.location;
                        var getleaderDataLoc1 = response.data.leaderboard.ranking;
                        $scope.getleaderDataLoc = response.data.leaderboard.location;
                        $rootScope.allLocation = [];
                        angular.forEach(response.data.leaderboard.location, function (v, k) {
                            $rootScope.allLocation.push(v);
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
            }
        })
        //leardership
        $scope.profileCLk = function (id) {
            $.fancybox.close('#leader-board');
        }
        $scope.card = true;
        $scope.setLocation = function (val) {
            $scope.card = true;
            start_val = 1;
            if (val.current_location == 'All') {
                var allSel = 'All';
                UserVerify.userLeaderboardbyLocation(allSel).then(function successCallback(response) {
                    $scope.rankingCount = response.data.leaderboard.ranking_count;
                    $scope.getleaderDataResult = response.data.leaderboard.ranking;
                    $scope.resultLength = $scope.getleaderDataResult.length;
                }, function errorCallback(response) {});
            } else {
                $scope.getUserLat = val.location_lat;
                $scope.getUserLng = val.location_lng;
                UserVerify.userLeaderboard($scope.getUserLat,$scope.getUserLng).then(function successCallback(response) {
                    $scope.rankingCount = response.data.leaderboard.ranking_count;
                    $scope.getleaderDataResult = response.data.leaderboard.ranking;
                }, function errorCallback(response) {});
            }
        }
        $scope.loadMore = function (event, myselect) {
            if (myselect.current_location == 'All') {
                UserVerify.lazyLeaderboardbyLocation(start_val).then(function (items) {
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
                UserVerify.userLeaderboardForLazy(myselect.location_lat,myselect.location_lng,start_val).then(function (items) {
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

        //logout
        $scope.appLogout = function () {
            logOut.logout().then(function (response) {
                console.log(response);
                localStorage.clear();
                $state.go('login');
            })
        }
        //login
        $rootScope.login = function () {
            console.log(window.location.href);
            localStorage.setItem("postDetail",window.location.href);
            LoginService.getLogin();
            CountryCode.getCountryCode().then(function (resposne) {
                console.log("country code", resposne);
                $scope.countryData = resposne.data;
            })
        };
        //otp Verification
        $rootScope.goToMobileVerf = function (user) {
            /*console.log(user)
             console.log(location_city,lat,lng);*/
            var umob = user.mobileNo;
            var umobcode = user.selCode;
            $scope.umobcode = umobcode;
            var uloc = (location_city != '') ? location_city : '';
            var location_lat = (location_city != '') ? lat : '';
            var location_lng = (location_city != '') ? lng : '';
            var uemail = user.email;
            angular.forEach($scope.countryData, function (v, k) {
                if (v.phonecode === umobcode) {
                    $scope.selCodeFlag = v.sxtenimgs;
                }
            })
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
            console.log("form data", datau);
            if (valid == 4) {
                OTP.getOTP(datau).then(function (response) {
                    console.log("OTP", response);
                    if (response.data.message === 'success') {
                        $scope.umobile = response.data.user_details[0].mobile;
                        $scope.umcode = response.data.user_details[0].code;
                        $scope.umflag = response.data.user_details[0].flag;
                        jQuery.fancybox({
                            'href': '#otp',
                            'closeBtn': false,
                            keys: {
                                close: null
                            }
                        });
                    }
                    else if (response.data.user_type === "mobile") {
                        angular.element('#errorphone').text('Mobile Number Already Exists');
                        angular.element('#umobile').css('border-bottom', '1px solid #f00');
                        angular.element('#umobile').focus();
                        angular.element('#umobile').val('');
                        return false;
                    } else if (response.data.user_type === "email") {
                        angular.element('#erroremail').text('Email Already Exists');
                        angular.element('#uemail').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                        angular.element('#uemail').focus();
                        angular.element('#uemail').val('');
                        return false;
                    }
                })
            }

        };
        $rootScope.OTPVerify = function (otpNo) {
            var umob = $scope.umobile;
            console.log("otpVerify daata",umob,$scope.umobile);
            var otpno = otpNo;
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
                var OTPData = {
                    otp_code: otpno,
                    mobile: umob
                };
                OTPVerify.verifyOTP(OTPData).then(function (response) {
                    console.log("OTP Verify response", response);
                    if (response.data.message == 'success') {
                        jQuery.fancybox.close();
                        $state.go('timeline.post', {}, {reload: 'timeline.post'}, {inherit: false}, {notify: true});
                    } else if (response.data.message == 'failed') {
                        if (response.data.type) {
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
        $rootScope.resendOTP = function (umob) {
            console.log($scope.userData)
            var datau = {
                code: $scope.userData[0].code,
                flag: $scope.userData[0].flag,
                mobile: umob,
                rechange: '1'
            };
            OTP.getOTP(datau).then(function (response) {
                $scope.umobile = response.data.user_details[0].mobile;
            });
        };
        $rootScope.wrongNo = function (e) {
            angular.element(e.currentTarget);
            jQuery.fancybox({
                'href': '#change-mob-no',
                'closeBtn': false,
                keys: {
                    close: null
                }
            });
        };
        $rootScope.changeno = function (user) {
            var umobcode = user.selCode;
            var umob1 = user.mobile;
            $scope.umobile=user.mobile;
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
                OTP.getOTP(datau).then(function (response) {
                    if (response.data.message == 'success') {
                        $scope.umobile = response.data.user_details[0].mobile;
                        jQuery.fancybox({
                            'href': '#otp',
                            'closeBtn': false,
                            keys: {
                                close: null
                            }
                        });
                    }else if (response.data.user_type == 'mobile') {
                        angular.element('#errorphone2').text('Mobile Number Already Exists');
                        angular.element('#mobile1').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                        angular.element('#mobile1').focus();
                        return false;
                    }
                });
            }
        }
        $rootScope.goBack = function () {
            jQuery.fancybox({
                'href': '#otp',
                'closeBtn': false,
                keys: {
                    close: null
                }
            });
        };
        dynamicNotifications.notifyNow();

        //cricular progressbar
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

        $rootScope.deletePostingImage = function (imgNum) {
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
        $rootScope.proceedToPost = function () {
            console.log("called post ")
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
                post_id: ($state.current.name==='timeline.editPost') ? $stateParams.id : 0
            };
            var formdata = new FormData();
            formdata.append('post', angular.toJson($scope.model));
            angular.forEach(apiFiles, function (value, key) {
                api_Files[key] = dataURLtoFile1(value, 'image' + key);
                formdata.append('files' + key, api_Files[key]);
            });
            ImageUpload.upload(formdata).then(function (response) {
                console.log(response);
                jQuery('.fountain_proceed').hide();
                if (response.data.message === 'success') {
                    $rootScope.objs3files = response.data.image.post_image;
                    $rootScope.mains3files = response.data.image.post_image[0];
                    $rootScope.objs3files_thumb = response.data.image.post_thumbimage;
                    $rootScope.post_id = response.data.image.post_id;
                    $.fancybox.close();
                    if ($state.current.name === 'timeline.editPost') {
                        $window.location.reload();
                    } else {
                        $state.go('timeline.newPost');
                    }
                }
            });
        }
        // image upload option

        $rootScope.proceedTocancel = function () {
            jQuery('.fountain_proceed').hide();
                $.fancybox.close();
                /*$rootScope.totalFilesAdded = 0;
                $rootScope.posting_img1 = '';
                $rootScope.posting_img2 = '';
                $rootScope.posting_img3 = '';
                $rootScope.posting_img4 = '';
                $rootScope.canvasCurrent = 0;
                $rootScope.isEditing = '';*/

        }
        $rootScope.getImage_data = function () {
            jQuery('.crop_continue').show();
            console.log("called getImage")
            if ($state.current.name === 'timeline.editPost') {
                $rootScope.isEditing = 1;
                $rootScope.doWatch($rootScope.posting_img1);
            }
            jQuery.fancybox({
                'href': '#myimage_uploader',
                'closeBtn': true,
                keys: {
                    close: null
                }
            });
        }
    }]);