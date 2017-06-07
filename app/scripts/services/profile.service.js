'use strict';
angular.module('Happystry.services')
    .factory('profileService', function ($http, Settings, $state, Properties, roundProgressService, $log, $q) {
        function getProfileById(id,page) {
            var user_id=localStorage.getItem("user_id");
            //console.log("inside factory",OTPData);
            var deferred = $q.defer();
            var user_id=localStorage.getItem("user_id");
            //console.log("userid",user_id);
            var header='';
            if(user_id){
                header={
                    'Content-Type': 'application/json',
                    'User-Id':user_id,
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }else{
                header={
                    'Content-Type': 'application/json',
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                }
            }
            $http({
                method: 'GET',
                url: Settings.BASE_URL + 'user/userprofile_feeds?user_id=' +id + '&page=' + page,
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
        function userHandler(val) {
            var deferred = $q.defer();
            var user_id=localStorage.getItem("user_id");
            //console.log("userid",user_id);
            $http({
                method: 'POST',
                url: Settings.BASE_URL  + "user/happyhandler",
                data: {
                    happy_handler: val
                },
                headers: {'Content-Type': 'application/json',
                    'User-Id':user_id,
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
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

        }
        function uploadCover(fd) {
            var deferred = $q.defer();
            var user_id=localStorage.getItem("user_id");
            //console.log("userid",user_id);
            $http({
                method: 'POST',
                url: Settings.BASE_URL + 'user/covpro',
                data: fd,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ',
                    'User-Id': user_id
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
        }
        function getFollowers(userid) {
            var deferred = $q.defer();
            var user_id=localStorage.getItem("user_id");
            //console.log("userid",user_id);
            $http({
                method: 'GET',
                url: Settings.BASE_URL+ 'user/followers?user_id=' + userid,
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ', 'User-Id': user_id}
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
        }
        function getFollowings(userid) {
            var deferred = $q.defer();
            var user_id=localStorage.getItem("user_id");
            $http({
                method: 'GET',
                url: Settings.BASE_URL + 'user/following?user_id=' + userid,
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ', 'User-Id': user_id}
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
        }
        function Follow(usrId) {
            var deferred = $q.defer();
            var user_id=localStorage.getItem("user_id");
            $http({
                method: 'POST',
                url: Settings.BASE_URL + "user/follow",
                data: {
                    followed_id: usrId
                },
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ', 'User-Id': user_id}
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
        }
        function unFollow(usrId) {
            var deferred = $q.defer();
            var user_id=localStorage.getItem("user_id");
            $http({
                method: 'POST',
                url: Settings.BASE_URL + "user/unfollow",
                data: {
                    followed_id: usrId
                },
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ', 'User-Id': user_id}
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
        }



        return {
            getProfileById:getProfileById,
            userHandler:userHandler,
            uploadCover:uploadCover,
            getFollowers:getFollowers,
            getFollowings:getFollowings,
            Follow:Follow,
            unFollow:unFollow

        };

    });