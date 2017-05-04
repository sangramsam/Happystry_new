/**
 * Created by appy-tech-18 on 3/5/17.
 */
'use strict';
angular.module('Happystry.services')
    .factory('OTPVerify', function ($http, Settings, $state, $log, $q) {
        function verifyOTP(OTPData) {
            var user_id=localStorage.getItem("user_id");
            //console.log("inside factory",OTPData);
            var deferred = $q.defer();
            $http({
                method: 'put',
                url: Settings.BASE_URL+ 'user/verifyotp',
                data:OTPData,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Id':user_id,
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
            verifyOTP: verifyOTP
        }

    });