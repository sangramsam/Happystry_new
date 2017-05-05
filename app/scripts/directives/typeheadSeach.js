angular.module('Happystry.directives').directive('typeahead', function ($timeout,Settings, $http, $window, $rootScope) {
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
                        url: Settings.BASE_URL + "rewards/suggestfilter?query=" + searchValue,
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
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
        },
        templateUrl: '/app/views/directive_template/autosearch.html',
    };
});