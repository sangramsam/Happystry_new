angular.module('Happystry.controllers').controller('editprofileController', ['$scope','UserVerify','CountryCode','Settings','$rootScope', '$http', '$window', '$location','dynamicNotifications',
    function ($scope,UserVerify,CountryCode,Settings, $rootScope, $http, $window, $location,dynamicNotifications) {
        $rootScope.dataLoaded = false;
        //autocomplete city
        $scope.result1 = '';
        $scope.options1 = {
            types: '(cities)'
        };
        $scope.details1 = '';
        //autocomplete city
        var countryCodeData = [];
        var selectedCountry;
        $scope.showSelCode = function (val) {
            val = val.replace(/[^\/\d]/g, '');
            selectedCountry = val;
            $scope.selCode = selectedCountry;
            angular.forEach($scope.countryData, function (v, k) {
                if (v.phonecode == selectedCountry) {
                    $scope.selCodeFlag = v.sxtenimgs;
                }
            })
        }
        CountryCode.getCountryCode().then(function successCallback(response) {
            $scope.countryData = response.data;
            countryCodeData = response.data;
            angular.forEach($scope.countryData, function (value, key) {
                if (value.phonecode == $scope.countryCode) {
                    $scope.selCode = $scope.countryData[key].phonecode;
                    selectedCountry = $scope.selCode;
                }
            });
        });
        UserVerify.userData().then(function successCallback(response) {
            $scope.getEditProfileData = response.data.profile.personal[0];
            $scope.location = response.data.profile.personal[0].current_location;
            $scope.prolocation = response.data.profile.personal[0].current_location;
            $scope.prolocation_lat = response.data.profile.personal[0].location_lat;
            $scope.prolocation_lng = response.data.profile.personal[0].location_lng;
            $scope.countryCode = response.data.profile.personal[0].mobile_code;
            $scope.businessEditData = response.data.profile.business[0];
            $scope.currencyData = response.data.profile.currency;
            console.log("userdetail",response)
            angular.forEach($scope.currencyData, function (value, key) {
                if (value.currency_code == $scope.businessEditData.currency) {
                    $scope.selCurr = $scope.currencyData[key].currency_code;
                }
            });
            angular.forEach(countryCodeData, function (value, key) {
                if (value.phonecode == $scope.countryCode) {
                    $scope.selCode = countryCodeData[key].phonecode;
                    selectedCountry = $scope.selCode;
                }
            });

            if ($scope.businessEditData.mobile_code != "") {
                angular.forEach($scope.countryData, function (value, key) {
                    if (value.phonecode == $scope.businessEditData.mobile_code && value.sxtenimgs == $scope.businessEditData.country_flag) {
                        $scope.selCode = $scope.countryData[key];
                        selectedCountry = $scope.selCode;
                    } else {
                        $scope.selCode = "IND(91)";
                        $scope.selCode = $scope.selCode.replace(/[^\/\d]/g, '');
                        selectedCountry = $scope.selCode;
                    }
                });
            }
            if ($scope.businessEditData.shop_name == null &&
                $scope.businessEditData.address1 == null &&
                $scope.businessEditData.address2 == null &&
                $scope.businessEditData.country == null &&
                $scope.businessEditData.city == null &&
                $scope.businessEditData.currency == null &&
                $scope.businessEditData.pincode == null &&
                $scope.businessEditData.state == null) {
                $scope.show = true;
                $scope.edit = false;
            } else {
                $scope.show = false;
                $scope.edit = true;
            }
            $rootScope.dataLoaded = true;
        }, function errorCallback(response) {
        });
        $scope.show = false;
        $scope.editPrf = true;
        $scope.edit = true;
        $scope.editable = true;
        $scope.cancelSave = function () {
            $scope.dataLoaded = true;
            $window.location.reload();
        };
        $scope.editClk = function (e) {
            angular.element(e.currentTarget).parents('.card').find('.button-holder').addClass('show');
            angular.element(e.currentTarget).parents('.card').find('.fieldholder input').addClass('show');
            angular.element(e.currentTarget).parents('.card').find('.fieldholder select').removeClass('ng-hide');
            angular.element(e.currentTarget).parents('.card').find('.fieldholder select').addClass('show');
        };
        angular.element('.button-holder').hide();
        angular.element('.fieldholder').find('input').hide();
        angular.element('.fieldholder').find('select').hide();
        var selectedCurrency;
        $scope.showSelCurr = function (val) {
            selectedCurrency = val;
            $scope.selCurr = selectedCurrency;
        }

        $scope.auto_loca = function () {
            location_auto = false;
            location_city = '';
            lat = '';
            lng = '';
        }
        $scope.saveProfileData = function (e) {
            var unsme = angular.element('#name').val();
            var umobcode = angular.element('#countrycode').val();
            $scope.showSelCode(umobcode);
            var umob = angular.element('#mobile').val();
            var uloc = (location_city != '') ? location_city : angular.element('#loc').val();
            var location_lat = (location_city != '') ? lat : $scope.prolocation_lat;
            var location_lng = (location_city != '') ? lng : $scope.prolocation_lng;
            var ushopname = angular.element('#shop-name').val();
            var uabtme = angular.element('#aboutme').val();
            var uaddr1 = angular.element('#address1').val();
            var ucity = angular.element('#city').val();
            var ustate = angular.element('#state').val();
            var upin = angular.element('#pin').val();
            var uaddr2 = angular.element('#address2').val();
            var ucountry = angular.element('#country').val();
            var ucurrency = angular.element('#currency').val();
            $scope.showSelCurr(angular.element('#currency').val());
            var valid = 0;
            var valid1 = 0;
            if ($scope.prolocation == uloc) {
                location_auto = true;
            }
            var onlyNum = /^\d+$/;
            var onlyAlpha = /^[A-z\s]+$/;

            if (unsme === '') {
                angular.element('#error_name').text('Please enter the Name').show();
                angular.element('#name').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                angular.element('#name').focus();
                return false;
            } else if (unsme.length < 3) {
                angular.element('#error_name').text('Name must have min 3 char ').show();
                angular.element('#name').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                angular.element('#name').focus();
                return false;
            } else if (unsme.length > 30) {
                angular.element('#error_name').text('Name must within 30 char').show();
                angular.element('#name').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                angular.element('#name').focus();
                return false;
            } else {
                angular.element('#name').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                angular.element("#error_name").text('').hide();
                valid++;
            }

            if (uloc === '') {
                angular.element('#error_loc').text('Please enter location').show();
                angular.element('#loc').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                angular.element('#loc').focus();
                return false;
            } else if (location_auto == false) {
                angular.element('#error_loc').text('Please pick a valid location').show();
                angular.element('#loc').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                angular.element('#loc').focus();
                return false;
            } else {
                angular.element('#loc').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                angular.element("#error_loc").text('').hide();
                valid++;
            }
            if (umob === '') {
                angular.element('#error_phone').text('Please enter the phone number');
                angular.element('#mobile').css('border-bottom', '1px solid #f00');
                angular.element('#mobile').focus();
                return false;
            } else if (!onlyNum.test(umob)) {
                angular.element('#error_phone').text('Please enter only numbers');
                angular.element('#mobile').css('border-bottom', '1px solid #f00');
                angular.element('#mobile').focus();
                return false;
            } else {
                angular.element('#mobile').css('border-bottom', '1px solid #d7e7ec');
                angular.element("#error_phone").text('');
                valid++;
            }

            if (umobcode === undefined) {
                angular.element('#error_phone').text('Please select country code');
                angular.element('#countrycode').css('border-bottom', '1px solid #f00');
                angular.element('#countrycode').focus();
                return false;
            } else {
                angular.element('#mobile').css('border-bottom', '1px solid #d7e7ec');
                angular.element("#error_phone").text('');
                valid++;
            }
            if (ushopname === '' && uaddr1 === '' && ucountry === '' && ucity === '' && ustate === '' && upin === '') {
                valid1 = valid;
            } else if (ushopname != null || uaddr1 != null || ucountry != null || ucurrency != null || ucity != null || ustate != null || upin != null) {
                if (ushopname == '') {
                    angular.element('#error_shopname').text('Please enter shop name').show();
                    angular.element('#shop-name').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#shop-name').focus();
                    return false;
                } else {
                    angular.element('#shop-name').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    angular.element("#error_shopname").text('').hide();
                    valid++;
                }
                if (ucurrency == '') {
                    angular.element('#error_currency').text('Please select currency').show();
                    angular.element('#currency').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#currency').focus();
                    return false;
                } else {
                    angular.element('#currency').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    angular.element("#error_currency").text('').hide();
                    valid++;
                }
                if (uaddr1 == '') {
                    angular.element('#error_address1').text('Please enter shop address').show();
                    angular.element('#address1').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#address1').focus();
                    return false;
                } else {
                    angular.element('#address1').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    angular.element("#error_address1").text('').hide();
                    valid++;
                }
                if (ucountry == '') {
                    angular.element('#error_country').text('Please enter country').show();
                    angular.element('#country').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#country').focus();
                    return false;
                } else if (!onlyAlpha.test(ucountry)) {
                    angular.element('#error_country').text('Please enter only alphabets').show();
                    angular.element('#country').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#country').focus();
                    return false;
                } else {
                    angular.element('#country').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    angular.element("#error_country").text('').hide();
                    valid++;
                }
                if (ustate == '') {
                    angular.element('#error_state').text('Please enter state').show();
                    angular.element('#state').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#state').focus();
                    return false;
                } else if (!onlyAlpha.test(ustate)) {
                    angular.element('#error_state').text('Please enter only alphabets').show();
                    angular.element('#state').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#state').focus();
                    return false;
                } else {
                    angular.element('#state').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    angular.element("#error_state").text('').hide();
                    valid++;
                }
                if (ucity == '') {
                    angular.element('#error_city').text('Please enter city').show();
                    angular.element('#city').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#city').focus();
                    return false;
                } else if (!onlyAlpha.test(ucity)) {
                    angular.element('#error_city').text('Please enter only alphabets').show();
                    angular.element('#city').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#city').focus();
                    return false;
                } else {
                    angular.element('#city').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    angular.element("#error_city").text('').hide();
                    valid++;
                }
                if (upin == '') {
                    angular.element('#error_pin').text('Please enter pincode').show();
                    angular.element('#pin').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                    angular.element('#pin').focus();
                    return false;
                } else {
                    angular.element('#pin').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
                    angular.element("#error_pin").text('').hide();
                    valid++;
                }

                valid1 = valid;
            } else {
                valid1 = valid;
            }

            if (valid1 == valid) {
                var data_val = {
                    name: unsme,
                    code: umobcode,
                    mobile: umob,
                    flag: $scope.selCodeFlag,
                    location: uloc,
                    location_lat: location_lat,
                    location_lng: location_lng,
                    shop_name: ushopname,
                    address1: uaddr1,
                    address2: uaddr2,
                    country: ucountry,
                    currency: ucurrency,
                    city: ucity,
                    state: ustate,
                    pincode: upin,
                    aboutme: uabtme,
                    rechange: '0'
                };
                UserVerify.userUpdate(data_val).then(function successCallback(response) {
                    if (response.data.message == 'success') {
                        $rootScope.userData = response.data.user_details;
                        if ($rootScope.userData) {

                            $rootScope.umobile = response.data.user_details[0].mobile;
                            $rootScope.umcode = response.data.user_details[0].code;
                            $rootScope.umflag = response.data.user_details[0].flag;
                            jQuery.fancybox({
                                'href': '#otp',
                                'closeBtn': false});
                            return false;
                        } else {
                            angular.element(e.currentTarget).parents('.button-holder').hide();
                            $window.location.reload();
                        }
                        $scope.editPrf = true;
                        $rootScope.dataLoaded = false;
                    } else {
                        if (response.data.user_type == 'mobile') {
                            angular.element('#error_phone').text('Mobile Number Already Exists');
                            angular.element('#mobile').css('border-bottom', '1px solid #f00');
                            angular.element('#mobile').val('');
                            angular.element('#mobile').focus();
                            return false;
                        }
                    }

                }, function errorCallback(response) {});
            }

        };
        document.getElementById('loc').addEventListener('keypress', function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
            }
        });

    }]);





