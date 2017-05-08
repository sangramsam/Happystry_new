/**
 * @name Happystry.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * Controller of the Happystry used in login state
 */
angular.module('Happystry.controllers')
    .controller('AuthCtrl', ['$scope', '$http', 'userSubscription', 'OTP', 'OTPVerify', 'CountryCode', 'FacebookService', 'LoginService', 'ViewService', '$state', '$rootScope', 'Settings', '$window', function ($scope, $http, userSubscription, OTP, OTPVerify, CountryCode, FacebookService, LoginService, ViewService, $state, $rootScope, Settings, $window) {
        'use strict';
        $scope.pageFlag = 0;
        $scope.SelectedCollection = 'All';
        $scope.SelectedHash = '';
        var scroll = true;
        var hashFlag = false;
        var collectionFlag = false;
        $scope.getPostData = [];
        $scope.getPromotedData = [];
        function resetProperty() {
            $scope.pageFlag = 0;
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

        function loadPost() {
            ViewService.getFeeds({page: $scope.pageFlag}).then(function (response) {
                $scope.pageFlag += 10;
                scroll = true;
                console.log(response.data.Posts);
                //$scope.getPostData.push(response.data.Posts);
                //$scope.getPromotedData.push(response.data.Promoted);
                $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
                $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);

                console.log("post data", $scope.getPostData, $scope.getPostData.length);
            }, function (response) {
            });
            $scope.busy = false;
        }

        loadPost();
        ViewService.getCollections().then(function (response) {
            $scope.getCollectionData = response.data.collections;
        }, function (response) {
        });

        ViewService.getTrendingHashTag().then(function (response) {
            $scope.getTrendingData = response.data.trending;
        }, function (response) {
        });

        $scope.playVideo = function () {
            ViewService.openFancyBox({id: "#videoPop"});
        };


        /*------------------ Round circle on feeds --------------------------------*/
        $scope.roundProgress = ViewService.roundProgressInitialization();
        $scope.getColor = function () {
            return $scope.gradient ? 'url(#gradient)' : $scope.roundProgress.currentColor;
        };
        /*------------------ end of round circle feeds ---------------------------*/
        //collection filter
        $scope.collectionFilter = function (coll_name) {
            if (collectionFlag === false || coll_name=='All' ) {
                resetProperty();
            }
            $scope.SelectedCollection = coll_name;
            ViewService.getFilterCollections(coll_name, $scope.pageFlag).then(function (response) {
                collectionFlag = true;
                $scope.pageFlag += 10;
                $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
                $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);

                //console.log($scope.getPostData, $scope.getPromotedData);
            })

        };
        //hashtag filter
        $scope.hashFilter = function (hash_name) {
            if (hashFlag === false) {
                resetProperty();
            }
            $scope.SelectedHash = hash_name;
            $scope.SelectedCollection = 'All';
            ViewService.getFilterHashTag(hash_name, $scope.pageFlag).then(function (response) {
                hashFlag = true;
                $scope.pageFlag += 10;
                $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
                $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);

                //console.log($scope.getPostData, $scope.getPromotedData);
            })
        };
        $scope.loadMore = function () {
            $scope.busy = true;
            console.log("called lazy loading");
            loadPost();
        };


        //facebook login
        $scope.login = function () {
            LoginService.getLogin();
            CountryCode.getCountryCode().then(function (resposne) {
                console.log("country code", resposne);
                $scope.countryData = resposne.data;
            })
        };


        //OTP verification
        $scope.umobile = '';
        $scope.otpNo = '';
        $scope.goToMobileVerf = function (user) {
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
        $scope.OTPVerify = function (otpNo) {
            var umob = $scope.umobile;
            console.log("otpVerify daata", umob, $scope.umobile);
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
                        /*jQuery.fancybox({
                         'href': '#bookmark-popup',
                         'closeBtn': false,
                         keys: {
                         close: null
                         }});*/
                        jQuery.fancybox.close();
                        $state.go('timeline');
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
        $scope.resendOTP = function (umob) {
            var datau = {
                code: $scope.umobcode,
                flag: $scope.selCodeFlag,
                mobile: umob,
                rechange: '1'
            };
            OTP.getOTP(datau).then(function (response) {
                $scope.umobile = response.data.user_details[0].mobile;
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
        $scope.changeno = function (user) {
            var umobcode = user.selCode;
            var umob1 = user.mobile;
            $scope.umobile = user.mobile;
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
                    } else if (response.data.user_type == 'mobile') {
                        angular.element('#errorphone2').text('Mobile Number Already Exists');
                        angular.element('#mobile1').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                        angular.element('#mobile1').focus();
                        return false;
                    }
                });
            }
        }
        $scope.goBack = function () {
            jQuery.fancybox({
                'href': '#otp',
                'closeBtn': false,
                keys: {
                    close: null
                }
            });
        };

        //like button
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

        //email subscription
        $scope.submitSub = function (email) {
            var subEmail = email;
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
                userSubscription.Subcribe(subEmail).then(function (response) {
                    console.log(response)
                    if (response.data.status) {
                        if (response.data.message === 'success') {
                            angular.element('#error_email').css('color', 'green');
                            angular.element('#error_email').text('Successfully subscribed').show();

                        } else {
                            angular.element('#error_email').text(response.data.type).css('color', 'green').show();
                        }
                    }
                });
            }
        };

        //lazy loading
        angular.element($window).on('scroll', function () {

            var fixed = $(".discover-more-fixed").offset().top;
            // 315
            if ($(this).scrollTop() >= fixed) {
                $('.header-new-home').addClass('header-up');
                $('.first-filter').addClass('first-filter-fixed');

            } else {
                $('.header-new-home').removeClass('header-up');
                $('.first-filter').removeClass('first-filter-fixed');
            }

            /* scroll to end */
            var footer_distance = 70;
            var document_height = $(document).height();

            var relative = $('.discover-more-relative').offset().top;

            if (($('.discover-more-relative').isOnScreen() === true || $(this).scrollTop() >= relative) && scroll === true) {
                scroll = false;
                console.log("called scroll");
                if ($scope.SelectedCollection != 'All') {
                    console.log("called load collection", $scope.SelectedCollection);
                    $scope.collectionFilter($scope.SelectedCollection);
                } else if ($scope.SelectedHash != '') {
                    $scope.hashFilter($scope.SelectedHash);
                } else {
                    console.log("called load post");
                    loadPost();
                }
            }

            if ($('.discover-more-relative').isOnScreen() === true || $(".discover-more-fixed").isOnScreen() === true || $('footer').isOnScreen() === true) {
                $('.fb-more').removeClass('fb-fixed');
            } else if ($(".discover-more-fixed").isOnScreen() === false) {
                $('.fb-more').addClass('fb-fixed');
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
    