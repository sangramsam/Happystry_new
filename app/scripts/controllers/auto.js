/**
 * @name Happystry.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * Controller of the Happystry used in login state
 */
angular.module('Happystry.controllers')
    .controller('autoselect', ['$scope', '$http', 'OTP', 'OTPVerify', 'CountryCode', 'FacebookService', 'LoginService', 'ViewService', '$state', '$rootScope', 'Settings', function ($scope, $http, OTP, OTPVerify, CountryCode, FacebookService, LoginService, ViewService, $state, $rootScope, Settings) {
        'use strict';
        $state.go('timeline.post');
    }]);
