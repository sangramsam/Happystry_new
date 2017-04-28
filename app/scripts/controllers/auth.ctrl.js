/**
 * @name Happystry.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * Controller of the Happystry used in login state
 */
angular.module('Happystry.controllers')
  .controller('AuthCtrl', ['$scope','$http','AuthService','$state','$rootScope','Settings', function ($scope, $http, AuthService, $state,$rootScope, Settings) {
  	'use strict';

  $scope.getData = function(){
  	$http({
		method: 'GET',
		url: Settings.BASE_URL+"/post?page=0",
		headers: {'Content-Type': 'application/json',
				 'HAPPI-API-KEY': "TRR36-PDTHB-9XBHC-PPYQK-GBPKQ"},

    }).then(function (response) {
    	console.log("success", response);
    },function(response){
    	console.log("failure", response);
    });
  };
  
  $scope.getData();

  }]);
    