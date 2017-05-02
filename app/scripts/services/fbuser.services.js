'use strict';
angular.module('Happystry.services')
    .factory('FacebookService', function ($http, Settings, $state, Properties, $log,$q, ezfb) {
        function getUserDetail(){
            console.log("get user detail !!");
            var deferred = $q.defer();
            ezfb.api('/me', {
                fields: 'name, gender'
            }, function (res, status) {
                console.log(res);
                deferred.resolve({
                    status: status,
                    data: res
                });
            },function(res, status, headers, config){
                deferred.reject({
                    status: status,
                    data: res
                });
            });
            return deferred.promise;
        }





        return{
            getUserDetail:getUserDetail

        };

    });