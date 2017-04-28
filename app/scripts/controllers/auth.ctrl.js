/**
 * @name Happystry.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * Controller of the Happystry used in login state
 */
angular.module('Happystry.controllers')
  .controller('AuthCtrl', ['$scope','$http','AuthService','ViewService','roundProgressService','$state','$rootScope','Settings', function ($scope, $http, AuthService, ViewService,roundProgressService, $state,$rootScope, Settings) {
  	'use strict';

  	ViewService.getFeeds({page:0}).then(function(response){
  		$scope.getPostData = response.data.Posts;
    	$scope.getPromotedData = response.data.Promoted;
    },function(response){});	

  	ViewService.getCollections().then(function(response){
  		$scope.getCollectionData = response.data.collections;
  	},function(response){});

  	ViewService.getTrendingHashTag().then(function(response){
  		$scope.getTrendingData = response.data.trending;
  	},function(response){});

	$scope.playVideo = function () {
		ViewService.openFancyBox({id:"#videoPop"});
	};

	$scope.getColor = function () {
	    return $scope.gradient ? 'url(#gradient)' : $scope.currentColor;
	};

    $scope.max = 100;
    $scope.offset = 0;
    $scope.timerCurrent = 0;
    $scope.uploadCurrent = 0;
    $scope.stroke = 2;
    $scope.radius = 20;
    $scope.isSemi = false;
    $scope.rounded = false;
    $scope.responsive = false;
    $scope.clockwise = true;
    $scope.currentColor = '#f47354';
    $scope.bgColor = '#ccc';
    $scope.duration = 800;
    $scope.currentAnimation = 'easeOutCubic';
    $scope.animationDelay = 0;
    $scope.animations = [];
    angular.forEach(roundProgressService.animations, function (value, key) {
        $scope.animations.push(key);
    });

  }]);
    