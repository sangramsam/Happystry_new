'use strict';
angular.module('Happystry.services')
    .factory('FilterService', function ($http, Settings, $state, Properties, roundProgressService, $log, $q) {


        function getSuggestFilerUser(page,word) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: Settings.BASE_URL + 'rewards/suggestfilter?query=' + word + '&users=All&page=' + page,
                headers: {
                    'Content-Type': 'application/json',
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }).then(function (response, status, headers, config) {
                deferred.resolve({
                    status: status,
                    data: response.data
                });
            }, function (response, status, headers, config) {
                deferred.reject({
                    status: status,
                    data: response.data
                });
            });
            return deferred.promise;
        };
        function getSuggestFilerPost(page,word) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: Settings.BASE_URL + 'rewards/suggestfilter?query=' +word + '&posts=All&page=' + page,
                headers: {
                    'Content-Type': 'application/json',
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }).then(function (response, status, headers, config) {
                deferred.resolve({
                    status: status,
                    data: response.data
                });
            }, function (response, status, headers, config) {
                deferred.reject({
                    status: status,
                    data: response.data
                });
            });
            return deferred.promise;
        };



        return {
            getSuggestFilerUser:getSuggestFilerUser,
            getSuggestFilerPost:getSuggestFilerPost
        };

    });