/**
 * Created by appy-tech-18 on 3/5/17.
 */
'use strict';
angular.module('Happystry.services')
    .factory('NewPost', function ($http, Settings, $state, $log, $q) {
        function addNewPost(formdata) {
            var user_id=localStorage.getItem("user_id");
            //console.log("inside factory",user);
            if(user_id){
                var header= {
                    'Content-Type': undefined,
                    'User-Id':user_id,
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }else{
                var header= {
                    'Content-Type': undefined,
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }

            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: Settings.BASE_URL + "post",
                data:formdata,
                transformRequest: angular.identity,
                headers: header
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
            addNewPost: addNewPost
        }

    });