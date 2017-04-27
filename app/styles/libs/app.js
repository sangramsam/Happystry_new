var app = angular.module('myApp',
        ['mainController', 'ngRoute', 'angularGrid', 'ui.bootstrap', 'ezfb',
            'hljs', 'angular-svg-round-progressbar', '720kb.socialshare',
            'timeIntervalServices', 'timeIntervalDirectives', 'ngSanitize',
            'ngAutocomplete', 'ngStorage', 'base64', 'angular.filter', 'angular-img-cropper'])
        //wu.masonry
        .config(function (ezfbProvider) {
            /**
             * Basic setup
             *
             * https://github.com/pc035860/angular-easyfb#configuration
             */
            ezfbProvider.setInitParams({
                appId: fb_appid
            });
        });

var mainController = angular.module('mainController', []);
if (api_url === window.location.href) {
    window.location.href = api_url + "home";
}
mainController.service('postDataUpdate', function ($http, $rootScope, ViewService) {
    return {
        updateNow: function (clickedPostId) {
            return $http({
                method: 'GET',
                url: api_url + 'post/PostInner?post_id=' + clickedPostId,
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                if (response.data.message != 'failed') {
                    var hashData = [];
                    var val_desc = (response.data.post.posts[0].description).split(" ");
                    angular.forEach(val_desc, function (valdesc, ky) {
                        var sds = valdesc.split("\n");
                        angular.forEach(sds, function (valsds, k) {
                            var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                            match = re.exec(valsds);
                            if (match) {
                                var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                hashData.push(res);
                            } else {
                                hashData.push(valsds);
                            }
                        });
                    });

                    response.data.post.posts[0].description = hashData.join(' ');
                    if (ViewService.previousPost !== undefined) {
                        angular.forEach(ViewService.previouspromPost, function (vprp, k) {
                            if (clickedPostId === vprp['post_id']) {
                                ViewService.previouspromPost[k] = response.data.post.posts[0];
                            }
                        });
                        angular.forEach(ViewService.previousPost, function (vnrp, vpk) {
                            if (clickedPostId === vnrp['post_id']) {
                                ViewService.previousPost[vpk] = response.data.post.posts[0];
                            }
                        });
                    } else {
                        angular.forEach($rootScope.getPostData, function (rnrp, rgk) {
                            if (clickedPostId === rnrp['post_id']) {
                                $rootScope.getPostData[rgk] = response.data.post.posts[0];
                            }
                        });
                        angular.forEach($rootScope.getPromotedData, function (rprp, rgpk) {
                            if (clickedPostId === rprp['post_id']) {
                                $rootScope.getPromotedData[rgpk] = response.data.post.posts[0];
                            }
                        });
                    }
                } else {
                    if (ViewService.previousPost !== undefined) {
                        angular.forEach(ViewService.previouspromPost, function (vprp, k) {
                            if (clickedPostId === vprp['post_id']) {
                                (ViewService.previouspromPost).splice([k],1);
                            }
                        });
                        angular.forEach(ViewService.previousPost, function (vnrp, vpk) {
                            if (clickedPostId === vnrp['post_id']) {
                                (ViewService.previousPost).splice([vpk],1);
                            }
                        });
                    } else {
                        angular.forEach($rootScope.getPostData, function (rnrp, rgk) {
                            if (clickedPostId === rnrp['post_id']) {
                                ($rootScope.getPostData).splice([rgk],1);
                            }
                        });
                        angular.forEach($rootScope.getPromotedData, function (rprp, rgpk) {
                            if (clickedPostId === rprp['post_id']) {
                                ($rootScope.getPromotedData).splice([rgpk],1);
                            }
                        });
                    }
                }
            }, function errorCallback(response) { });
        }
    }
});
mainController.service('dynamicNotifications', function ($http, $rootScope, msgServices) {
    return {
        notifyNow: function () {
            $http({
                method: 'GET',
                url: api_url + "rewards/usersmsg",
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                if (response.data.logged == false) {
                } else {
                    $rootScope.msgnotify1 = 0;
                    $rootScope.getNotificationDataAll1 = msgServices.notifyListFxn(response.data.users.contact);
                    angular.forEach($rootScope.getNotificationDataAll1, function (value, key) {
                        $rootScope.msgnotify1 += (value.msgcount != 0) ? 1 : 0;
                    });
                    if ($rootScope.msgnotify1 != 0) {
                        $('a.message-icon #mybadge').show();
                    }
                }
            }, function errorCallback(response) { });
            return $http({
                method: 'GET',
                url: api_url + "rewards/notification?call=0",
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                $rootScope.getNotificationData1 = response.data.notification;
                if ($rootScope.getNotificationData1.length > 0) {
                    $('a.notification-icon #mybadge').show();
                }
                return response.data.notification;
            }, function errorCallback(response) { });
        }
    }
});
mainController.directive("closePopup", [function () {
        return {
            restrict: "A",
            link: function ($scope, element, attrs) {
                element.bind('click', function () {
                    $.fancybox.close();
                });
            }
        };
    }]);

mainController.directive("leadershipPopup", [function () {
        return {
            restrict: "A",
            link: function ($scope, element, attrs) {
                element.bind('click', function () {
                    $.fancybox("#leader-board");
                });
            }
        };
    }]);

mainController.directive("searchWebPopup", [function () {
        return {
            restrict: "A",
            link: function ($scope, element, attrs) {
                element.bind('click', function () {
                    $.fancybox("#search-web");
                });
            }
        };
    }]);

mainController.directive('myCollections', function () {
    return {
        restrict: 'A',
        templateUrl: '/home/collections',
        scope: false
    };

});

mainController.directive('rewardSlider', function () {
    return {
        restrict: 'A',
        templateUrl: '/home/rewardslider',
        scope: false

    };

});

mainController.directive('myPosts', function () {
    return {
        restrict: 'A',
        templateUrl: '/home/posts',
        scope: false
    };


});
mainController.directive('allComments', function () {
    return {
        restrict: 'A',
        templateUrl: '/home/allcomments',
        scope: false
    };
});

mainController.filter("lowercasenospace", function () {
    return function (lowercasenospace) {
        var str = lowercasenospace.replace(/[^A-Z0-9]/ig, "");
        return str.toLowerCase();
    }
});

mainController.factory('getRewards', function ($http) {
    return {
        getRewardsData: function () {
            return $http({
                method: 'GET',
                url: api_url + 'rewards',
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                return response.data.rewards;

            }, function errorCallback(response) { });
        }
    }


});
mainController.factory('getCollections', function ($http) {
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
mainController.service('getRewardInner', function ($http, $route) {
    var rewardId = $route.current.params.reward_id;
    return {
        getRewardInnerData: function () {
            return $http({
                method: 'GET',
                url: api_url + 'rewards/rewards_inner?reward_id=' + rewardId,
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                return response.data.rewards;

            }, function errorCallback(response) { });
        }
    }


});
mainController.service('likeFuntion', function ($http) {
    return {
        sendLike: function (postid, event) {
            var isLiked = angular.element(event.currentTarget).find('a.like-unlike').hasClass('liked');
            var likenum = angular.element(event.currentTarget).find('span.likes-comments').text();
            if (isLiked) {
                result = 0;
                angular.element(event.currentTarget).find('a.like-unlike').removeClass('liked');
                angular.element(event.currentTarget).find('a.like-unlike').addClass('like');
                angular.element(event.currentTarget).find('span.likes-comments').text(likenum - 1);
            } else {
                result = 1;
                angular.element(event.currentTarget).find('a.like-unlike').removeClass('like');
                angular.element(event.currentTarget).find('a.like-unlike').addClass('liked');
                angular.element(event.currentTarget).find('span.likes-comments').text(+likenum + +1);

            }
            var postId = postid;

            return $http({
                method: 'POST',
                url: api_url + "post/like",
                data: {
                    post_id: postId,
                    like: result
                },
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
            }, function errorCallback(response) {
            });
        }
    };


});
// var code = (e.keyCode ? e.keyCode : e.which);
//                if (code === 13) { //Enter keycode
//                    var searchValue = angular.element(e.currentTarget).val();
//                    $http({
//                        method: 'GET',
//                        url: api_url + "rewards/suggestfilter?query=" + searchValue,
//                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
//                    }).then(function successCallback(response) {
//                        scope.getSearchData = response.data;
//                    }, function errorCallback(response) { });
//
//                    $window.location.href = "#/search/query/" + searchValue;
//                    angular.element(e.currentTarget).parent().find('div.list-group').fadeOut();
//                    angular.element(e.currentTarget).focusout();
//                }
mainController.directive('typeahead', function ($timeout, $http, $window, $rootScope) {
    return {
        restrict: 'AEC',
        scope: {
            title: '@',
            retkey: '@',
            displaykey: '@',
            modeldisplay: '=',
            subtitle: '@',
            modelret: '='
        },
        link: function (scope, elem, attrs) {
            var searchValue = '';
            scope.current = 0;
            scope.selected = false;
            scope.resetClose = function () {
                angular.element('typeahead').find('.ty-search').val('');
                angular.element('.reset_close').hide();
            };
            scope.da = function (txt, e) {
                searchValue = angular.element('typeahead').find('.ty-search').val();
                scope.searchval = searchValue;
                angular.element('#autosugg').hide();
                if (searchValue.length > 1) {
                    angular.element('.reset_close').show();
                    angular.element('body').find('#preloader').addClass('eee');
                    $http({
                        method: 'GET',
                        url: api_url + "rewards/suggestfilter?query=" + searchValue,
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                    }).success(function (data, status) {
                        if (data.suggestion != undefined) {
                            $rootScope.dataLoaded = true;
                            angular.element('#autosugg').show();
                            scope.TypeAheadData = data.suggestion;
                            angular.forEach(scope.TypeAheadData.posts, function (value, key) {
                                var collection = '';
                                angular.forEach(value.collections, function (col_val, ckey) {
                                    if (ckey != 0) {
                                        collection += ',';
                                    }
                                    collection += col_val;
                                });

                                scope.TypeAheadData.posts[key].collections = collection;
                            });
                            scope.ajaxClass = '';
                        } else {
                            scope.TypeAheadData = '';
                        }
                    });
                } else {
                    angular.element('.reset_close').hide();
                }
            }
            scope.isCurrent = function (index) {
                return scope.current == index;
            }
            scope.setCurrent = function (index) {
                scope.current = index;
            }
//            scope.checkIfEnterKeyWasPressed = function($event){
//                return false;
//                var keyCode = $event.which || $event.keyCode;
//                if (keyCode === 13) {
//                 if (searchValue.length > 3) {
//                    $http({
//                        method: 'GET',
//                        url: api_url + "rewards/suggestfilter?query=" + searchValue,
//                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
//                    }).success(function (data, status) {
//                        if (data.suggestion != undefined) {
//                            scope.TypeAheadData = data.suggestion;
//                            scope.ajaxClass = '';
//                        } else {
//                            scope.TypeAheadData = '';
//                        }
//                    });
//                }
//                }
//
//              };
        },
        templateUrl: '/home/autosearch',
//        '<input class="ty-search" type="text"  ng-model="modeldisplay" ng-KeyUp="da(modeldisplay, $event)"  ng-keydown="selected=false" style="width:100%;" ng-class="ajaxClass">' +
//                    '<div class="list-group table-condensed overlap" id="autosugg" ng-hide="!modeldisplay.length || selected" style="width:100%">' +
//                        '<div ng-if="TypeAheadData.users!=undefined" ng-controller="timelineController"><a> Users</a> <a ng-click="allUsers(searchval)">All Users</a>' +
//                            '<div class="list-group-item noTopBottomPad" ng-repeat="item in TypeAheadData.users|filter:model  track by $index" ng-click="handleSelection(item[retkey],item[displaykey])" style="cursor:pointer" ng-class="{active:isCurrent($index)}" ng-mouseenter="setCurrent($index)">' +
//                                '<div>{{item.percentile}}<img ng-src="{{item.profile_image}}">{{item.name}},{{item.user_id}}</div>' +
//                            '</div>' +
//                        '</div>' +
//                        '<div class="post-div" ng-if="TypeAheadData.posts!=undefined" ng-controller="timelineController"><a style="display:inline-block;">Posts</a> <a style="display:inline-block;" ng-click="allPosts(searchval)">All Posts</a>' +
//                            '<div class="list-group-item noTopBottomPad" ng-repeat="item in TypeAheadData.posts|filter:model  track by $index" ng-click="handleSelection(item[retkey],item[displaykey])" style="cursor:pointer" ng-class="{active:isCurrent($index)}" ng-mouseenter="setCurrent($index)">' +
//                                '<div><img ng-src="{{item.post_image[0]}}">{{item.collections}},{{item.description}},{{item.name}},{{item.post_id}}</div>' +
//                            '</div>' +
//                        '</div>' +
//                    '</div>' +
//                '</input>'
    };
});//autocomplete

mainController.directive('compile', ['$compile', function ($compile) {
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
    }]);//ng-sanitize

mainController.service('editProfileService', function () {
    return {
        edit_profile: function () {
            var j_name = angular.element('#uname').val();
//    var j_age = $('#j_age').val();
//    var j_city = $('#j_city').val();
//    var j_phone = $('#j_phone').val();
            var valid = 0;

            if (j_name == '') {
                angular.element('#error_name').text('Please enter the Name').show();
                angular.element('#uname').css('border-color', 'red');
                angular.element('#uname').focus();
                return false;
            } else {
                angular.element("#error_name").text('').hide();
                angular.element('#uname').css('border-color', 'inherit');
                valid++;
            }

//    if (j_age == '') {
//        $('#error_age').text('Please enter the age').show();
//        $('#j_age').css('border-color', 'red');
//        $('#j_age').focus();
//        return false;
//    } else {
//        $("#error_age").text('').hide();
//        $('#j_age').css('border-color', 'inherit');
//        valid++;
//    }
//
//    if (j_city == '') {
//        $('#error_city').text('Please enter the number').show();
//        $('#j_city').css('border-color', 'red');
//        $('#j_city').focus();
//        return false;
//    } else {
//        $("#error_city").text('').hide();
//        $('#j_city').css('border-color', 'inherit');
//        valid++;
//    }
//
//    if (j_phone == '') {
//        $('#error_phone').text('Please enter the phone number');
//        $('#j_phone').css('border-color', 'red');
//        $('#j_phone').focus();
//        return false;
//    } else if ((j_phone.length) < 10 || (j_phone.length) > 15) {
//        $('#error_phone').text('Please enter 10 digit phone number');
//        $('#j_phone').css('border-color', 'red');
//        $('#j_phone').focus();
//        return false;
//    } else {
//        $("#error_phone").text('');
//        $('#j_phone').css('border-color', 'inherit');
//        valid++;
//    }
        }
    };


});
var objvalues = [];
var filevalues = [];
var deleteimgs = [];
mainController.service('commonService', function () {

    var objInfo1;
    var objInfo2;
    var info1;
    var info2;
    var delinfo;
    var postImgMB;
    var postImgCount;

    return {
        getInfoObjFiles: getInfoObjFiles,
        getInfoObjSrc: getInfoObjSrc,
        setInfoObjFiles: setInfoObjFiles,
        setInfoObjSrc: setInfoObjSrc,
        getInfoFiles: getInfoFiles,
        getInfoSrc: getInfoSrc,
        setInfoFiles: setInfoFiles,
        setInfoSrc: setInfoSrc,
        emtInfoFiles: emtInfoFiles,
        emtInfoSrc: emtInfoSrc,
        emtInfoObjFiles: emtInfoObjFiles,
        setdeleteImgs: setdeleteImgs,
        getdeleteImgs: getdeleteImgs,
        emtdelImgs: emtdelImgs,
        setPostImageSize: setPostImageSize,
        getPostImageSize: getPostImageSize,
    };

    // .................

    function setdeleteImgs(value) {
        deleteimgs.push(value);
        delinfo = deleteimgs;
    }
    function getdeleteImgs() {
        return delinfo;
    }

    function emtdelImgs(value) {
        deleteimgs = [];
        delinfo = [];
        value = [];
        return delinfo;
    }

    function getInfoObjFiles() {
        return objInfo1;
    }
    function getInfoObjSrc() {
        return objInfo2;
    }
    function emtInfoSrc() {
        return objInfo1;
    }
    function emtInfoFiles(value) {
        objvalues = [];
        filevalues = [];
        value = [];
        objInfo1 = [];
        objInfo2 = [];
        info1 = [];
        info2 = [];
        return objInfo2;
    }

    function emtInfoObjFiles(value) {
        objvalues = [];
        filevalues = [];
        value = [];
        objInfo1 = [];
        objInfo2 = [];
        info1 = [];
        info2 = [];
        return objInfo1;
    }

    function setInfoObjFiles(value) {
        objInfo1 = value;
    }
    function setInfoObjSrc(value) {
        objInfo2 = value;
    }

    function getInfoFiles() {
        return info1;
    }
    function getInfoSrc() {
        return info2;
    }

    function setInfoFiles(value) {
        info1 = value;
    }
    function setInfoSrc(value) {
        info2 = value;
    }
    function setPostImageSize(value) {
        postImgMB = value;
    }
    function getPostImageSize() {
        return postImgMB;
    }

});
//file upload service
mainController.directive('ngFileModel', ['$parse', '$location', 'commonService', '$route', '$routeParams', function ($parse, $location, commonService, $route, $routeParams) {

        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {
                var model = $parse(attrs.ngFileModel);
                var isMultiple = attrs.multiple;
                var modelSetter = model.assign;

                element.bind('change', function () {
                    var isValidFile = true;
                    var addedSize = commonService.getPostImageSize();
                    if (addedSize === undefined) {
                        addedSize = 0;
                    }
                    var sizeLimit = 4;
                    var combinedSize = parseFloat(addedSize) * (1024 * 1024);
                    angular.forEach(element[0].files, function (item, i) {
                        if (item.type == 'image/jpeg' || item.type == 'image/png') {
                            combinedSize += parseFloat(item.size);
                            var sizeInMB = (combinedSize / (1024 * 1024)).toFixed(2);
                            if (sizeInMB < sizeLimit && $route.current.loadedTemplateUrl !== '/home/editpost') {
                                var value = {
                                    // File Name 
                                    name: item.name,
                                    //File Size 
                                    size: item.size,
                                    //File URL to view 
                                    url: URL.createObjectURL(item),
                                    //file type
                                    type: item.type,
                                    // File Input Value 
                                    _file: item
                                };
                                objvalues.push(value);
                                filevalues.push(item);
                            } else if (sizeInMB < sizeLimit && $route.current.loadedTemplateUrl === '/home/editpost') {
                                var value = {
                                    // File Name 
                                    name: item.name,
                                    //File Size 
                                    size: item.size,
                                    //File URL to view 
                                    url: URL.createObjectURL(item),
                                    //file type
                                    type: item.type,
                                    // File Input Value 
                                    _file: item
                                };
                                objvalues.push(value);
                                filevalues.push(item);
                            }
                        } else {
                            isValidFile = false;
                        }
                    });
                    scope.$apply(function () {
                        if (isValidFile === false) {
                            alert("Please upload valid image!");
                        } else if (isMultiple) {
                            var sizeInMB = (combinedSize / (1024 * 1024)).toFixed(2);
                            if (objvalues.length > 5) {
                                alert("You can select maximum of only 4 images. First 4 images will be selected..");
                                objvalues = [];
                                filevalues = [];
                                return false;
                            } else if (sizeInMB > sizeLimit) {
                                alert("Please ensure that the size of the images in total is less than " + sizeLimit + "MB");
                            } else {
                                //console.log(objvalues);
                                commonService.setPostImageSize(sizeInMB);
                                modelSetter(scope, objvalues);
                                commonService.setInfoObjFiles(objvalues);
                                commonService.setInfoFiles(filevalues);

                                if ($route.current.loadedTemplateUrl === '/home/editpost') {
                                    $location.path('/editpost/').search({q: $route.current.params.q});
                                } else {
                                    $location.path('/newpost');
                                }
                            }
                        } else {
                            var sizeInMB = (combinedSize / (1024 * 1024)).toFixed(2);
                            if (sizeInMB > sizeLimit && $location.path() == '/newpost') {
                                if ($location.path() == '/newpost') {
                                    //alert("Already uploaded " + commonService.getPostImageSize() + "MB of images, Please upload the combined images size less than " + sizeLimit + "MB.");
                                    alert("Please ensure that the size of the images in total is less than " + sizeLimit + "MB");
                                }
                            } else if (sizeInMB > sizeLimit && $location.path() != '/newpost') {
                                alert("Please ensure that the size of the images in total is less than " + sizeLimit + "MB");
                            } else {
                                commonService.setPostImageSize(sizeInMB);
                                modelSetter(scope, objvalues[0]);
                                modelSetter(scope, element[0].files[0]);
                                if ($route.current.loadedTemplateUrl === '/home/editpost') {
                                    $location.path('/editpost/').search({q: $route.current.params.q});
                                } else {
                                    $location.path('/newpost');
                                }

                                commonService.setInfoObjFiles(objvalues);
                                commonService.setInfoFiles(filevalues);
                            }
                        }
                    });
                    this.value = null;
                    return false;
                });
            }
        };
    }]);
//file upload directive


mainController.directive('icheck', function () {
    return {
        restrict: 'A',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs) {

            element.iCheck({
                checkboxClass: "icheckbox_square-orange"
            });

            element.on('ifChanged', function (event) {
                scope.$apply(function () {
                    scope.ngModel = true;
                });
            });

            element.on('ifUnchecked', function (event) {
                scope.$apply(function () {
                    scope.ngModel = false;
                });
            })
        }
    };
});
mainController.filter('reverseOrder', function () {
    return function (items) {
        return items.slice().reverse();
    };
});
mainController.service('msgServices', function () {
    var msgList = [];
    var notifyList = [];
    this.msgAddFxn = function (data) {
        msgList.splice(0, 0, {'message': data.msg, 'cret_date': data.date_time, 'me': 1})
        return msgList;
    },
            this.msgListFxn = function (data) {
                msgList = data;
                return msgList;
            },
            this.notifyListFxn = function (data) {
                notifyList = data;
                return notifyList;
            },
            this.notifyReadFxn = function (data) {
                for (i in notifyList) {
                    if (notifyList[i].user_id == data.user_id) {
                        notifyList[i].msgcount = 0;
                    }
                }

                return notifyList;
            }
});
mainController.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});

mainController.filter('timeago', function ($filter) {
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




mainController.controller('AppCtrl', ['$scope', '$interval', function ($scope, $interval) {
        var self = this, j = 0, counter = 0;

        self.mode = 'query';
        self.activated = true;
        self.determinateValue = 30;
        self.determinateValue2 = 30;

        self.showList = [];

        /**
         * Turn off or on the 5 themed loaders
         */
        self.toggleActivation = function () {
            if (!self.activated)
                self.showList = [];
            if (self.activated) {
                j = counter = 0;
                self.determinateValue = 30;
                self.determinateValue2 = 30;
            }
        };

        $interval(function () {
            self.determinateValue += 1;
            self.determinateValue2 += 1.5;

            if (self.determinateValue > 100)
                self.determinateValue = 30;
            if (self.determinateValue2 > 100)
                self.determinateValue2 = 30;

            // Incrementally start animation the five (5) Indeterminate,
            // themed progress circular bars

            if ((j < 2) && !self.showList[j] && self.activated) {
                self.showList[j] = true;
            }
            if (counter++ % 4 === 0)
                j++;

            // Show the indicator in the "Used within Containers" after 200ms delay
            if (j == 2)
                self.contained = "indeterminate";

        }, 100, 0, true);

        $interval(function () {
            self.mode = (self.mode == 'query' ? 'determinate' : 'query');
        }, 7200, 0, true);
    }]);
