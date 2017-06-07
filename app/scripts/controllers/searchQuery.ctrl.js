
angular.module('Happystry.controllers').controller('searchQueryController', ['$scope','$window','$document','$stateParams','$state', '$http','ViewService','FilterService','profileService',
    function ($scope,$window,$document,$stateParams,$state, $http,ViewService,FilterService,profileService) {
        $scope.ddmodel = '';

        $scope.isUser=false;
        $scope.isPost=false;
        $scope.dd = $stateParams.q;
        $scope.page=0;
        $scope.fcClk = function ($event) {
            angular.element('.sub-menu').removeClass('ngshow');
            angular.element($event.currentTarget).next('.sub-menu').addClass('ngshow');
            $event.stopPropagation();
        }
        if($state.current.name.split('.')[1]==='Userquery'){
            angular.element('#autosugg').hide();
            $scope.isUser=true;
            FilterService.getSuggestFilerUser($scope.page,$scope.dd).then(function (response) {
                $scope.getPostUserData=response.data.suggestion.users;

            });
        }
        if($state.current.name.split('.')[1]==='Postquery'){
            angular.element('#autosugg').hide();
            $scope.isPost=true;
            FilterService.getSuggestFilerPost($scope.page,$scope.dd).then(function (response) {
                $scope.getSuggPostData = response.data.suggestion.posts;
            })
        }
        $scope.showSubmenu = function () {
            event.stopPropagation();
        }
        angular.element('.filter-more').hide();
        $scope.filterMore = function (e) {
            angular.element(e.currentTarget).parent().hide();
            $scope.allFilter = true;
            $scope.threeFilter = false;

        }
        angular.element('.page-title-holder').on('click', function () {
            event.stopPropagation();
        })
        angular.element('body').on('click', '#suggPost', function () {
            $scope.allFilter = false;
            $scope.threeFilter = true;
            angular.element('.filter-more').hide();
            angular.element('.filter-more').show();
        })

        $scope.cancelClkFlt = function (event) {
            angular.element(event.currentTarget).parents('.sub-menu.filter-show').removeClass('ngshow');
        };
        $scope.Formsearch = function () {
            var loc_id = angular.element('#loc').val();
            var col_chek = (angular.element('.collection-box').find('.checked')).length;
            var forsale = (angular.element('.forSale').find('.checked')).length;
            if (loc_id == '' && col_chek == 0 && forsale == 0) {
                alert('You will get only Not Sale Post');
            }
            var location = '';
            var location_lat = '';
            var location_lng = '';
            if (loc_id == '') {
            } else {
                location = (location_area1 != '') ? location_area1 + ',' + location_city1 : '';
                location_lat = (lat != '') ? lat : '';
                location_lng = (lng != '') ? lng : '';
            }
            var for_sale = (angular.element('.forSale').find('.checked').length != 0) ? 'Y' : 'N';

            var collections = '';
            $scope.selected = [];
            var selSearch = $stateParams.q;
            if ((angular.element('.collection-box').find('.checked')).length != 0) {
                angular.forEach(angular.element('.collection-box').find('.checked'), function (value, key) {
                    if (key > 0) {
                        collections += '^';
                    }
                    collections += angular.element(value).next('i').text();
                    $scope.selected[key] = angular.element(value).next('i').text();
                    $scope.colseled[key] = angular.element(value).next('i').text();
                });
            }

            $scope.model = {
                collections: collections,
                location: location,
                lat: location_lat,
                lng: location_lng,
                for_sale: for_sale
            };
            ($scope.selected).push(location);
            ($scope.locseled).push(location);
            ($scope.selected).push((for_sale != 'N') ? 'Sale' : "");
            ($scope.forseled).push((for_sale != 'N') ? 'Sale' : "");
            ($scope.serseled).push(selSearch);
            $scope.ser_worddd = $stateParams.q;
            $rootScope.apiFlrwrd = $scope.ser_worddd;
            $rootScope.apiFlrslt = $scope.selected;
            $rootScope.apiFlrmdl = $scope.model;
            seaPage = 0;
            $scope.apiFilter($scope.ser_worddd, $scope.selected, $scope.model);
        }
        $scope.apiFilter = function (selSearch, seleCted, modelVal) {

            $scope.ddmodel = $.extend([], seleCted);
            $scope.dd = '';
            $scope.ser_worddd = $route.current.params.q;
            selSearch = $scope.ser_worddd;

            $http.get(api_url + "rewards/suggestfilter?query=" + $scope.ser_worddd + '&posts=All&page=' + seaPage, {
                headers: {
                    'DATA': angular.toJson(modelVal),
                    'HAPPI-API-KEY': api_key
                }
            }).success(function (response) {
                angular.element('.sub-menu').removeClass('ngshow');
                if (response.status) {
                    if (response.suggestion.length != 0) {
                        //from desc string taking #tags and inserting anchor tag dynamically
                        angular.forEach(response.suggestion.posts, function (value, key) {
                            var hashData = [];
                            var val_desc = (value.description).split(" ");
                            angular.forEach(val_desc, function (valdesc, ky) {
                                var sds = valdesc.split("\n");
                                angular.forEach(sds, function (valsds, k) {
                                    var re = /(?:^|\W)#(\w+)(?!\w)/g, match1;
                                    match1 = re.exec(valsds);
                                    if (match1) {
                                        var res = match1[0].replace(match1[0], '<a ng-href="#/search/hashtag/' + match1[1] + '" >' + match1[0] + '</a>');
                                        $compile(res)($scope);
                                        hashData.push(res);
                                    } else {
                                        hashData.push(valsds);
                                    }
                                });
                            });

                            response.suggestion.posts[key].description = hashData.join(' ');
                        });
                        if ((response.suggestion.posts).length != 0) {
                            $rootScope.sealoadmore = true;
                        } else {
                            $rootScope.sealoadmore = false;
                        }
                        if (seaPage == 0) {
                            $scope.getSuggPostData = response.suggestion.posts;
                        } else {
                            $scope.getSuggPostData = ($scope.getSuggPostData).concat(response.suggestion.posts);
                        }
                        angular.forEach($scope.getSuggPostData, function (v, k) {
                            var splitRowObject = v.location.split(',');
                            if (splitRowObject.length > 0)
                                $scope.getSuggPostData[k].location = splitRowObject[0];
                        });
//                                $scope.userpostLoad();
                    } else {
                        $rootScope.sealoadmore = false;
                        $scope.getSuggPostData = response.suggestion;
                    }
                }
            });
        };
        ViewService.getCollections().then(function (response) {
            $scope.getCollectionData = response.data.collections;
        }, function (response) {
        });


        //remove selected
        $scope.removeSelected = function (index) {

            if ($scope.searchurl) {
                if ($scope.isPost) {
                    var location = (location_area1 != '') ? location_area1 + ',' + location_city1 : '';
                    var location_lat = (location_city1 != '') ? lat : '';
                    var location_lng = (location_city1 != '') ? lng : '';
                    var for_sale = (angular.element('.forSale').find('.checked').length != 0) ? 'Y' : 'N';
                    var collections = '';
                    var selSearch = $stateParams.q;
                    if ($stateParams.q === index) {
                       $state.go('timeline.post');
                    } else {
                        $scope.splice = $scope.selected;
                        $scope.selected = [];
                        $scope.selected = $scope.splice;
                        $scope.selected.splice($scope.selected.indexOf(index), 1);
                        $scope.model = {
                            collections: collections,
                            location: location,
                            lat: location_lat,
                            lng: location_lng,
                            for_sale: for_sale
                        };
                        if ($scope.selected.length === 1) {
                            $state.go('timeline.post');
                        } else {
                            $scope.apiFilter(selSearch, $scope.selected, $scope.model);
                        }
                    }
                } else {
                    $state.go('timeline.post');
                }
            } else {
                $state.go('timeline.post');
            }
        }

        //follow and unfollow
        $scope.userFollow = function (e, usrId) {
            if ($scope.logged_res === true) {
                $scope.loggin_pop(event);
            } else {
                var text = angular.element(e.currentTarget).find('a div').text();

                if (text === 'Follow') {
                    profileService.Follow(usrId).then(function (response) {
                        angular.element(e.currentTarget).find('a div').text('Unfollow');
                    });
                } else {
                    profileService.unFollow(usrId).then(function (response) {
                        angular.element(e.currentTarget).find('a div').text('Follow');
                    });
                }
            }
        };
        $scope.allUsers=function (word) {
            console.log(word);
            angular.element('#autosugg').hide();
            $scope.isUser=true;
            FilterService.getSuggestFilerUser($scope.page,word).then(function (response) {
                $scope.getPostUserData=response.data.suggestion.users;
            });
        }
        $scope.allPosts=function (word) {
            console.log(word)
            angular.element('#autosugg').hide();
            $scope.isPost=true;
            FilterService.getSuggestFilerPost($scope.page,word).then(function (response) {
                $scope.getSuggPostData = response.data.suggestion.posts;
            })
        }

    }]);



