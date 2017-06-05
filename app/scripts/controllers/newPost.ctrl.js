angular.module('Happystry.controllers').controller('newPostCtrl', ['$scope','UserVerify','NewPost','$state', '$http', '$rootScope', '$compile','getCollections', 'ViewService', 'commonService', 'ViewService2',
    function ($scope,UserVerify,NewPost,$state ,$http, $rootScope, $compile,getCollections, ViewService, commonService, ViewService2) {
        //limit checkbox to 3
        $scope.limit = 3;
        $scope.isChecked = 0;
        $scope.coll = [];
        $scope.isShared = false;
        $scope.activeImg = false;
        $scope.result = '';
        $scope.item = false;
        this.commonService = commonService;

        $scope.options = {
            types: '(regions)'
        };

        $scope.details = '';
        $scope.apifiles = [];
        $scope.uifiles = [];
        $scope.hClk = function (e) {
            $scope.descText = $scope.descText.concat(" " + "#" + e.tag_name);
        };

        $scope.selImg = function (val) {
            $scope.WebImgs = val;
            $.fancybox.close("#search-web");
        };

        $scope.cartClk = function () {
            UserVerify.userData().then(function successCallback(response) {
                $scope.getEditProfileData = response.data.profile.personal[0];
                $scope.businessEditData = response.data.profile.business[0];
                $scope.currencyData = response.data.profile.currency;
                angular.forEach($scope.currencyData, function (value, key) {
                    if (value.currency_code == $scope.businessEditData.currency) {
                        $scope.selCurr = $scope.currencyData[key];
                    }
                });
                if ($scope.businessEditData.shop_name == null ||
                    $scope.businessEditData.address1 == null ||
                    $scope.businessEditData.country == null ||
                    $scope.businessEditData.city == null ||
                    $scope.businessEditData.currency == null ||
                    $scope.businessEditData.pincode == null ||
                    $scope.businessEditData.state == null) {
                    jQuery.fancybox({
                        'href': '#edit-profile'
                    });
                } else {
                    $scope.cart = true;
                }
            }, function errorCallback(response) {});
        }
        var selectedCurrency;
        $scope.showSelCurr = function (val) {
            selectedCurrency = val.currency_code;
        }
        //the save method
       /* location_area1 = ViewService.geo_location;
        lat = ViewService2.geo_lat;
        lng = ViewService2.geo_lng;
        location_auto = ViewService2.locationauto;

        if (location_auto == true) {
            $rootScope.location = ViewService2.geo_location;
            angular.element('#location').attr('placeholder', $rootScope.location);
            angular.element('#location').val($rootScope.location);
        }*/
        //console.log("location",$rootScope.location,ViewService2.geo_location);
        $scope.auto_loca = function () {
            location_auto = false;
        }
        document.getElementById('location').addEventListener('keypress', function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
            }
        });

        angular.element('.error_collection').hide();
        angular.element('.error-loc').hide();
        $scope.Formsave = function (e) {
            console.log("form data",e);
            var collections = '';
            if (angular.element('.tags').find('input:checked').length == 0) {
                angular.element('.error_collection').text('Please select one collection to proceed').show();
                return false;
            } else {
                angular.element('.error_collection').hide();
                angular.element('.error-loc').hide();
                angular.forEach(angular.element('.tags').find('input:checked'), function (value, key) {
                    if (key > 0) {
                        collections += '^';
                    }
                    collections += value.name;
                });
            }

            var location = (location_area1 != '') ? location_area1 + ',' + location_city1 : '';
            var fullLoc = angular.element('#location').val();
            var location_lat = (lat != '') ? lat : '';
            var location_lng = (lng != '') ? lng : '';
            if ($rootScope.location === '') {
                angular.element('.error-loc').text('Please select a location').show();
                return false;
            } else if (location_auto == false) {
                angular.element('.error-loc').text('Please pick a valid location').show();
                return false;
            }
            var for_sale = (angular.element('#cart_cls.blue').length == 1) ? 'Y' : 'N';
            var link_cart = (angular.element('#link_cart.blue').length == 1) ? 'Y' : 'N';
            var link = angular.element('#link').val();
            var cost = (for_sale == 'Y') ? (angular.element('#price').val() != '') ? angular.element('#price').val() : '0' : '0';
            var quantity = (for_sale == 'Y') ? (angular.element('#qty').val() != '') ? angular.element('#qty').val() : '0' : '0';

            if (for_sale === 'Y') {
                if (cost === '0' || quantity === '0') {
                    angular.element('.error_forsale').text('Please enter price and quantity if you want to keep as sale post');
                    return false;
                }
            }

            if (link_cart === 'Y') {
                if (link === '') {
                    angular.element('.error_link').text('Please enter link');
                    return false;
                } else {
                    var re = /^(http(s)?:\/\/)*(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/, match;
                    match = re.exec(link);
                    if (match) {
                        if ((link.indexOf('http') !== 0) && (link.indexOf('www') !== 0)) {
                            link = 'http://www.' + link;
                        } else if (link.indexOf('http') !== 0) {
                            link = 'http://' + link;
                        }
                    } else {
                        angular.element('.error_link').text('Please enter valid link');
                        return false;
                    }
                }
            }

            var description = angular.element('#desc').val();

            $scope.model = {
                collections: collections,
                location: location,
                lat: location_lat,
                lng: location_lng,
                description: description,
                for_sale: for_sale,
                cost: cost,
                quantity: quantity,
                link: link,
                post_id: $scope.post_id,
                pre_imglink: $scope.objs3files.toString(),
                pre_thumimglink: $scope.objs3files_thumb.toString()
            };
            angular.element(e.currentTarget).find('#postData').addClass('disabled');
            angular.element(e.currentTarget).find('#postData').text('Posting...');
            var formdata = new FormData();
            formdata.append('post', angular.toJson($scope.model));
            console.log("form data",$scope.model);
            NewPost.addNewPost(formdata).then(function (response) {
                if (response.data.message == 'success') {
                    $scope.proceedTocancel();
                    $state.go('timeline.post');
                } else {
                    if (response.data.type == 'user blocked') {
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
        };

        $scope.checkChanged = function (item) {
            if (item.winner) {
                $scope.isChecked++;
            } else {
                $scope.isChecked--;
            }
        };
        //limit checkbox to 3
        $scope.loc = true;
        $scope.cart = false;
        $scope.link = false;
        $scope.img = 1;
        $scope.descText = "";
        $scope.showEnteredText = function (e) {
            var a = angular.element(e.currentTarget).text();
        };
        $scope.cancelSave = function () {
            jQuery.fancybox({
                'href': '#discard-post'
            });
        };
        $scope.discardPost = function () {
            $scope.proceedTocancel();
           $state.go('timeline.post');
        }

        //http call for collections
        $scope.getCollectionsSlider = [];
        getCollections.getCollectionsData().then(function (response) {
            $scope.getCollectionData = response;
        });
        //http call for collections
        ViewService.getTrendingHashTag().then(function successCallback(response) {
            $scope.getTrendingData = response.data.trending;
            return false;
        });
        $scope.removeItem = function (e) {
            angular.element(e.currentTarget).parent().remove();
        }
        //dynamicNotifications.notifyNow();

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

        /*=======================================================*/

        //save sale data
        $scope.saveProfileData = function (e) {
            var ushopname = angular.element('#shop-name').val();
            var uabtme = angular.element('#aboutme').val();
            var uaddr1 = angular.element('#address1').val();
            var ucity = angular.element('#city').val();
            var ustate = angular.element('#state').val();
            var upin = angular.element('#pin').val();
            var uaddr2 = angular.element('#address2').val();
            var ucountry = angular.element('#country').val();
            var ucurrency = selectedCurrency;
            var valid = 0;
            var valid1 = 0;
            var onlyAlpha = /^[A-z\s]+$/;
            if (ushopname != null || uaddr1 != null || ucountry != null || ucurrency != null || ucity != null || ustate != null || upin != null) {
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
            } else {
                $('#edit-profile').fancybox.close();
            }
            if (valid == 6) {
                var data_val = {
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
                        $.fancybox.close('#edit-profile');
                        $scope.cart = true;
                    }
                }, function errorCallback(response) {});
            }

        };
    }
]);
