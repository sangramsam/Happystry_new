/**
 * Created by appy-tech-18 on 3/5/17.
 */
'use strict';
angular.module('Happystry.services')
    .factory('logOut', function ($http, Settings, $state, $log, $q) {
        function logout() {
            var user_id=localStorage.getItem("user_id");
            //console.log("inside factory",OTPData);
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: Settings.BASE_URL+ "user/logout",
                headers: {
                    'Content-Type': 'application/json',
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }).then(function (response, status, headers, config) {
                deferred.resolve({
                    status: status,
                    data: response
                });
            }, function (response, status, headers, config) {
                deferred.reject({
                    status: status,
                    data: response
                });
            });
            return deferred.promise;
        };


        return {
            logout: logout
        }

    });