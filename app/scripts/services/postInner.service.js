/**
 * Created by appy-tech-18 on 3/5/17.
 */
'use strict';
angular.module('Happystry.services')
    .factory('PostInner', function ($http, Settings, $state, $log, $q) {
        function getInnerPost(postId,page) {
            var user_id=localStorage.getItem("user_id");
            //console.log("inside factory",user);
            if(user_id){
                var header= {
                    'Content-Type': 'application/json',
                    'User-Id':user_id,
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }else{
                var header= {
                    'Content-Type': 'application/json',
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }

            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: Settings.BASE_URL + 'post/PostInner?post_id=' + postId + '&page=' + page,
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
            getInnerPost: getInnerPost
        }

    });