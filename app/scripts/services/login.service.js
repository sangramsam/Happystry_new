'use strict';

/**
 * services/auth.service.js
 * ===========
 * This service is created to use provide service to AuthService controller.
 *
 * @class Happystry.services.AuthService
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 */
angular.module('Happystry.services')
    .factory('LoginService', function ($http, Settings,$state, $log, $q, $rootScope, ezfb,$location) {
        function getLogin() {
            console.log('called Login');
            //var deferred = $q.defer();
            ezfb.login(function (response, status) {
                /*deferred.resolve({
                    status: status,
                    data: response.authResponse
                })*/
                if (response.authResponse) {
                    updateLoginStatus(updateApiMe);
                }
            }, function (response, status, headers, config) {
                /*deferred.reject({
                    status: status,
                    data: response.authResponse
                });*/
            });
            //return deferred.promise;
        };
        function updateLoginStatus(more) {
            console.log('called update login')
            ezfb.getLoginStatus(function (res) {
                var loginStatus = res;
                (more || angular.noop)();
            });
        }

        function updateApiMe() {
            ezfb.api('/me', {
                fields: 'name, gender'
            }, function (res) {
                var apiMe = res;
                $http({
                    method: "post",
                    url: Settings.BASE_URL + 'user/',
                    data: {
                        id: res.id,
                        name: res.name,
                        gender: res.gender,
                    },
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).success(function (data) {
                    if (data.message == 'success') {
                        var id = data.user_id;
                        localStorage.setItem("user_id",id);

                        ezfb.api(
                            "/me/friends",
                            function (response) {
                               var friends = response.data;
                                var user_id = id;
                                console.log("Login Success  !!!");
                               //$state.go('timeline');
                                var data = {
                                    friends: friends,
                                    user_id: user_id
                                };
                                $http({
                                    method: "post",
                                    url: Settings.BASE_URL + 'user/friends_list',
                                    data: data,
                                    headers: {'Content-Type': 'application/json',
                                        'User-Id':user_id,
                                        'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                                }).success(function (data) {
                                    //localStorage.setItem("userData",userData);
                                    $rootScope.userData = data.user_welcome;
                                    console.log($rootScope.userData);
                                   // $state.go('timeline');
                                    if ($rootScope.userData) {
                                        jQuery.fancybox({
                                            'href': '#contactInfo',
                                            'closeBtn': false,
                                            keys: {
                                                close: null
                                            }
                                        });
                                        angular.element('body').find('#contactInfo').parents('.fancybox-wrap .fancybox-outer').siblings('a').addClass('aa');
                                        return false;
                                    } else {
                                        jQuery.fancybox.close();
                                        console.log("Login Success  !!!");
                                        if(localStorage.getItem("postDetail")){
                                            //$location.path(localStorage.getItem("postDetail"));
                                            window.location.reload();
                                            $window.location.href=localStorage.getItem("postDetail");
                                        }else {
                                            $state.go('timeline.post', {}, {reload: 'timeline.post'}, {inherit: false}, {notify: true});
                                            //$state.go('timeline');
                                        }
                                    }
                                });
                            });
                    } else {
                        if (data.type == 'user blocked') {
                            jQuery.fancybox({
                                'href': '#user-blocked',
                                'closeBtn': true,
                                keys: {
                                    close: null
                                }
                            });
                        }
                    }
                });
            });
            return;
        }

        return {
            getLogin: getLogin
        };

    });