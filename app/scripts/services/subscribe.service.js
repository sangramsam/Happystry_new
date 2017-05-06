/**
 * Created by appy-tech-18 on 3/5/17.
 */
'use strict';
angular.module('Happystry.services')
    .factory('userSubscription', function ($http, Settings, $state, $log, $q) {
        function Subcribe(subEmail) {
            var deferred = $q.defer();
            $http({
                method: "post",
                url: Settings.BASE_URL+  'user/subscribe',
                data: {
                    email: subEmail
                },
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
            Subcribe: Subcribe
        }

    });