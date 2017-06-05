angular.module('Happystry.controllers').controller('editpostController', ['$scope','$state','UserVerify','NewPost', '$http','ViewService', '$rootScope', '$compile','PostInner', 'getCollections', 'commonService','$stateParams', '$location', 'dynamicNotifications', 'postDataUpdate',
    function ($scope,$state,UserVerify,NewPost, $http,ViewService, $rootScope, $compile,PostInner, getCollections, commonService,$stateParams, $location, dynamicNotifications, postDataUpdate) {
        // edit post calling
        $scope.loc = true;
        $scope.cart = false;
        $scope.link = false;
        $scope.img = 1;
        $scope.descText = "";
        $scope.pdeCollection = '';
        $scope.showEnteredText = function (e) {
            var a = angular.element(e.currentTarget).text();
        };
        $scope.limit = 3;
        $scope.isChecked = 0;
        $scope.coll = [];
        $scope.isShared = false;
        $scope.activeImg = false;
        $scope.result = '';
        $scope.item = false;
        $scope.objEditPostfiles = [];
        $scope.files = [];
        $scope.deleteimgs = [];
        $scope.mainfileImg = [];
        var post_id = $stateParams.id;
        $scope.postDetailsLocation = [];
        $scope.postdetailCollection = [];
        $scope.editSuggestion = [];
        $scope.mainImg = [];
        $scope.tmbImge = [];
        $scope.tmbImgs = [];
        $scope.location_lat = "";
        $scope.location_lng = "";

        //http call for collections
        $scope.getCollectionsSlider = [];
        getCollections.getCollectionsData().then(function (response) {
            $scope.getCollectionData = response;
            PostInner.getInnerPostById(post_id).then(function successCallback(response) {
                if (response.data.message == "failed") {
                    $state.go('timeline.post');
                } else {
                    $scope.postdetails = response.data.post;
                    $scope.Collection = $scope.postdetails.posts[0].collections;
                    $scope.postdetailCollection = [];
                    angular.forEach($scope.getCollectionData, function (colval, ckey) {
                        angular.forEach($scope.Collection, function (pcolval, pckey) {
                            if (colval.collection_api_name === pcolval) {
                                if (pckey > 0) {
                                    $scope.pdeCollection += '^';
                                    $scope.postdetailCollection[pckey] = colval.collectionname;
                                }
                                $scope.pdeCollection += colval.collection_api_name;
                                $scope.postdetailCollection[pckey] = colval.collectionname;
                            }
                        });
                    });

                    $scope.postdetailsDesc = $scope.postdetails.posts[0].description;
                    $scope.descText = $scope.postdetailsDesc;
                    $scope.location = $scope.postdetails.posts[0].location;
                    $scope.location_lat = $scope.postdetails.posts[0].location_lat;
                    $scope.location_lng = $scope.postdetails.posts[0].location_lng;
                    location_auto = true;
                    angular.element('#location').removeAttr('placeholder');
                    $scope.editSuggestion = $scope.postdetails.posts[0].suggestion;
                    $scope.price = $scope.postdetails.posts[0].cost;
                    $scope.hreflink = $scope.postdetails.posts[0].link;
                    $scope.editCurrency = ($scope.postdetails.posts[0].currency == 0) ? '' : $scope.postdetails.posts[0].currency;
                    $scope.qty = ($scope.postdetails.posts[0].quantity == 0) ? '' : $scope.postdetails.posts[0].quantity;
                    $scope.objs3files_thumb = $scope.postdetails.posts[0].post_thump_image;
                    $scope.objs3files = $scope.postdetails.posts[0].post_image;
                    $rootScope.totalFilesAdded = ($scope.postdetails.posts[0].post_image).length;
                    $rootScope.canvasCurrent = 1;
                    $rootScope.posting_img1 = '';
                    $rootScope.posting_img2 = '';
                    $rootScope.posting_img3 = '';
                    $rootScope.posting_img4 = '';
                    function convertImgToDataURLviaCanvas(url, callback, outputFormat) {
                        var img = new Image();
                        img.crossOrigin = 'Anonymous';
                        img.onload = function () {
                            var canvas = document.createElement('CANVAS');
                            var ctx = canvas.getContext('2d');
                            var dataURL;
                            canvas.height = this.height;
                            canvas.width = this.width;
                            ctx.drawImage(this, 0, 0);
                            dataURL = canvas.toDataURL(outputFormat);
                            callback(dataURL);
                            canvas = null;
                        };
                        img.src = url;
                    }
                    function imageToBase64(imageurl, key) {
                        var imageUrl = imageurl.replace('https://', 'http://');
                        convertImgToDataURLviaCanvas(imageUrl, function (base64Img) {
                            if (key == 0) {
                                $rootScope.posting_img1 = base64Img;
                                $rootScope.act_img1 = $rootScope.posting_img1;
                                $rootScope.mains3files = $rootScope.posting_img1;
                                setTimeout(function () {
                                    jQuery('#editing_page_loader').hide();
                                    jQuery('#editing_page_images').show();
                                }, 2000);


                            }
                            if (key == 1) {
                                $rootScope.posting_img2 = base64Img;
                                $rootScope.act_img2 = $rootScope.posting_img2;
                            }
                            if (key == 2) {
                                $rootScope.posting_img3 = base64Img;
                                $rootScope.act_img3 = $rootScope.posting_img3;
                            }
                            if (key == 3) {
                                $rootScope.posting_img4 = base64Img;
                                $rootScope.act_img4 = $rootScope.posting_img4;
                            }
                        });
                        if ($rootScope.posting_img1 != '') {
                            setTimeout(function () {
                                jQuery('#editing_page_loader').hide();
                                jQuery('#editing_page_images').show();
                            }, 2000);


                        }
                    }

                    angular.forEach($scope.postdetails.posts[0].post_image, function (value, key) {
                        imageToBase64(value, key);

                    });
                    $rootScope.isEditing = '';
                }
                if ($scope.price != '' && $scope.qty != '') {
                    $scope.cart = true;
                }
                if ($scope.hreflink) {
                    $scope.link = true;
                }
                $rootScope.dataLoaded = true;
            }, function errorCallback(response) {
                $rootScope.dataLoaded = true;
            });
        });

        ViewService.getTrendingHashTag().then(function successCallback(response) {
            $scope.getTrendingData = response.data.trending;
        }, function errorCallback(response) {});
        $scope.hClick = function (e) {
            $scope.descText = $scope.descText.concat(" " + "#" + e.tag_name);
        };
        $scope.cancelEdit = function () {
            jQuery.fancybox({
                'href': '#discard-post'
            });
        };
        $scope.discardEdit = function () {
            $.fancybox.close('#discard-post');
            $scope.proceedTocancel();
            window.history.back();
            location.reload();
        };
        $scope.cartEditClk = function () {
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
                $.fancybox.close('#edit-profile');
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
                $http({
                    method: 'PUT',
                    url: api_url + 'user',
                    data: data_val,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                }).then(function successCallback(response) {
                    if (response.data.message == 'success') {
                        $.fancybox.close('#edit-profile');
                        $scope.cart = true;
                    }
                }, function errorCallback(response) {});
            }
        };

        $scope.auto_loca = function () {
            location_auto = false;
        }
        //the save method

        $scope.Formsave = function (e) {
            var collections = $scope.pdeCollection;
            angular.element('.error_collection').hide();
            angular.element('.error-loc').hide();

            var location = (location_area1 != '') ? location_area1 + ',' + location_city1 : '';
            var fullLoc = angular.element('#location').val();
            var location_lat = (lat != '') ? lat : '';
            var location_lng = (lng != '') ? lng : '';

            if (fullLoc == '') {
                $scope.location_lng = ''
                $scope.location_lat = '';
                $scope.location = '';
                angular.element('.error-loc').text('Please select current location').show();
                return false;
            } else if (location_area1 != '' || location_city1 != '') {
                location = (location_area1 != '') ? location_area1 + ',' + location_city1 : '';
                fullLoc = location;
                location_lat = (lat != '') ? lat : '';
                location_lng = (lng != '') ? lng : '';
            } else if (location_auto == false) {
                angular.element('.error-loc').text('Please pick a valid location').show();
                return false;
            } else {
                location_lng = $scope.location_lng;
                location_lat = $scope.location_lat;
                location = $scope.location;
                fullLoc = location;
            }
            var for_sale = (angular.element('#cart_cls.blue').length == 1) ? 'Y' : 'N';
            var link_cart = (angular.element('#link_cart.blue').length == 1) ? 'Y' : 'N';
            var cost = (for_sale == 'Y') ? (angular.element('#price').val() != '') ? angular.element('#price').val() : '0' : '0';
            var quantity = (for_sale == 'Y') ? (angular.element('#qty').val() != '') ? angular.element('#qty').val() : '0' : '0';
            if (for_sale == 'Y') {
                if (cost == '0' || quantity == '0') {
                    angular.element('.error_forsale').text('Please enter price and quantity if you want to keep as sale post');
                    return false;
                }
            }
            var link = angular.element('#link').val();

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
                location: fullLoc.toString(),
                lat: location_lat,
                lng: location_lng,
                description: description,
                for_sale: for_sale,
                cost: cost,
                quantity: quantity,
                link: link,
                post_id: post_id,
                cret_date: $scope.postdetails.posts[0].cret_date,
                total_comments: $scope.postdetails.posts[0].total_comments,
                total_likes: $scope.postdetails.posts[0].total_likes,
                reported_count: $scope.postdetails.posts[0].reported_count,
                promoted: $scope.postdetails.posts[0].promoted,
                pre_imglink: $scope.objs3files.toString(),
                pre_thumimglink: $scope.objs3files_thumb.toString()
            };
            angular.element(e.currentTarget).find('#postData').addClass('disabled');
            angular.element(e.currentTarget).find('#postData').text('Posting...');
            var formdata = new FormData();
            formdata.append('post', angular.toJson($scope.model));
            NewPost.addNewPost(formdata).then(function (response) {
                if (response.data.message === 'success') {
                    postDataUpdate.updateNow(post_id);
                    $scope.proceedTocancel();
                    window.history.back();
                    location.reload();
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
        };

        document.getElementById('location').addEventListener('keypress', function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
            }
        });

        dynamicNotifications.notifyNow();
    }]);