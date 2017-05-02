/**
 * @name Happystry.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * Controller of the Happystry used in login state
 */
angular.module('Happystry.controllers')
  .controller('AuthCtrl', ['$scope','$http','FacebookService','LoginService','ViewService','$state','$rootScope','Settings', function ($scope, $http,FacebookService, LoginService, ViewService,roundProgressService, $state,$rootScope, Settings) {
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


/*------------------ Round circle on feeds --------------------------------*/
	$scope.roundProgress = ViewService.roundProgressInitialization();
	$scope.getColor = function () {
	    return $scope.gradient ? 'url(#gradient)' : $scope.roundProgress.currentColor;
	};
/*------------------ end of round circle feeds ---------------------------*/

//facebook login
$scope.login=function () {
    var flag=LoginService.getLogin();
    console.log(flag);

    /*if (response===true) {
    	console.log("inside if block");
        FacebookService.getUserDetail().then(function (response) {
            $scope.userDetail = response.data;
            console.log($scope.userDetail);
        }, function (response) {
        });
        console.log("inside controller", response)
    }*/
}

}]);
    