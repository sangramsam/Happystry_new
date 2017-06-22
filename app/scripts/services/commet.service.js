/**
 * Created by appy-tech-18 on 3/5/17.
 */
'use strict';
angular.module('Happystry.services')
    .factory('comment', function ($http, Settings, $state, $log, $q) {
        function sendComment(postid,userComment) {
            var user_id=localStorage.getItem("user_id");
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: Settings.BASE_URL + "post/comment",
                data: {
                    post_id: postid,
                    comment: userComment
                },
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

        function editComment(postId,commentId,newcomment) {
            var user_id=localStorage.getItem("user_id");
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: Settings.BASE_URL + "post/comment",
                data: {
                    post_id: postId,
                    comment_id: commentId,
                    comment: newcomment
                },
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
        }
        function deleteComment(postId,commentId) {
            var user_id=localStorage.getItem("user_id");
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: Settings.BASE_URL + "post/comment_del",
                data: {
                    comment_id: commentId,
                    post_id: postId
                },
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
        }
        function seeMoreComment(postId) {
            var user_id=localStorage.getItem("user_id");
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: Settings.BASE_URL + 'post/comment?post_id=' + postId,
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
        }
        function sendLike(postId,result) {
            var user_id=localStorage.getItem("user_id");
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: Settings.BASE_URL + "post/like",
                data: {
                    post_id: postId,
                    like: result
                },
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
        }
        function showLike(postId) {
            var user_id=localStorage.getItem("user_id");
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: Settings.BASE_URL + "post/likes?post_id=" + postId,
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
        }


        return {
            sendComment: sendComment,
            editComment:editComment,
            deleteComment:deleteComment,
            seeMoreComment:seeMoreComment,
            sendLike:sendLike,
            showLike:showLike
        }

    });