angular.module('Happystry.controllers').controller('headerController', ['$scope','$state', 'logOut', 'UserVerify', 'Settings', 'ezfb', '$rootScope', '$http', '$timeout', '$window', 'roundProgressService', '$compile', 'commonService', '$location', 'angularGridInstance', '$localStorage', 'dynamicNotifications','OTP', 'OTPVerify', 'CountryCode', 'FacebookService', 'LoginService',
    function ($scope,$state, logOut, UserVerify, Settings, ezfb, $rootScope, $http, $timeout, $window, roundProgressService, $compile, commonService, $location, angularGridInstance, $localStorage, dynamicNotifications,OTP, OTPVerify, CountryCode, FacebookService, LoginService) {
        $scope.logged_res = false;
        $scope.otpNo='';
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
        function verifyUser() {
            UserVerify.verifyUser().then(function (res) {
                console.log(res);
                if (res.data.logged === false) {

                } else {
                    if (res.data.user_details) {
                        $scope.userData = res.data.user_details;
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
        //logout
        $scope.appLogout = function () {
            logOut.logout().then(function (response) {
                console.log(response);
                $state.go('login');
            })
        }
        //login
        $rootScope.login = function () {
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
                        $state.go('timeline', {}, {reload: 'timeline'}, {inherit: false}, {notify: true});
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
    }]);