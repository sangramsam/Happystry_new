/**
 * Created by appy-tech-18 on 3/5/17.
 */
'use strict';
angular.module('Happystry.services')
    .factory('CountryCode', function ($http, Settings, $state, $log, $q) {
        function getCountryCode() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: Settings.BASE_URL+ 'bookmarks/cntryflg',
                headers: {
                    'Content-Type': 'application/json',
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }).then(function (response, status, headers, config) {
                deferred.resolve({
                    status: status,
                    data: response.data.code
                });
            }, function (response, status, headers, config) {
                deferred.reject({
                    status: status,
                    data: response.data.code
                });
            });
            return deferred.promise;
        };


        return {
            getCountryCode: getCountryCode
        }

    });