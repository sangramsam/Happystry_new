/**
 * @name Happystry.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * Controller of the Happystry used in login state
 */
angular.module('Happystry.controllers')
  .controller('AuthCtrl', ['$scope','$http','OTP','CountryCode','FacebookService','LoginService','ViewService','$state','$rootScope','Settings', function ($scope, $http,OTP,CountryCode,FacebookService, LoginService, ViewService,roundProgressService, $state,$rootScope, Settings) {
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
    LoginService.getLogin();
    CountryCode.getCountryCode().then(function (resposne) {
		console.log("country code",resposne);
		$scope.countryData=resposne.data;
    })
    $scope.goToMobileVerf = function (user) {
    	/*console.log(user)
		console.log(location_city,lat,lng);*/
        var umob = user.mobileNo;
        var umobcode = user.selCode;
        var uloc = (location_city != '') ? location_city : '';
        var location_lat = (location_city != '') ? lat : '';
        var location_lng = (location_city != '') ? lng : '';
        var uemail = user.email;
        angular.forEach($scope.countryData, function (v, k) {
            if (v.phonecode ===umobcode) {
                $scope.selCodeFlag = v.sxtenimgs;
            }
        })
        var valid = 0;
        var onlyNum = /^\d+$/;
        var propEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

        if (uloc === '') {
            angular.element('#errorloc').text('Please enter location').show();
            angular.element('#uloc').parents('.fieldholder').css('border-bottom', '1px solid #f00');
            angular.element('#uloc').focus();
            return false;
        } else {
            angular.element("#errorloc").text('').hide();
            angular.element('#uloc').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
            valid++;
        }
        if (umobcode === undefined) {
            angular.element('#errorphone').text('Please select country code');
            angular.element('#countrycode').css('border-bottom', '1px solid #f00');
            angular.element('#countrycode').focus();
            return false;
        } else {
            angular.element("#errorphone").text('');
            angular.element('#countrycode').css('border-bottom', '1px solid #d7e7ec');
            valid++;
        }
        if (umob === '') {
            angular.element('#errorphone').text('Please enter the phone number');
            angular.element('#umobile').css('border-bottom', '1px solid #f00');
            angular.element('#umobile').focus();
            return false;
        } else if (!onlyNum.test(umob)) {
            angular.element('#errorphone').text('Please enter only numbers');
            angular.element('#umobile').css('border-bottom', '1px solid #f00');
            angular.element('#umobile').focus();
            return false;

        } else {
            angular.element("#errorphone").text('');
            angular.element('#umobile').css('border-bottom', '1px solid #d7e7ec');
            valid++;
        }
        if (uemail === '') {
            angular.element('#erroremail').text('Please enter email id');
            angular.element('#uemail').parents('.fieldholder').css('border-bottom', '1px solid #f00');
            angular.element('#uemail').focus();
            return false;
        } else if (!propEmail.test(uemail)) {
            angular.element('#erroremail').text('Please enter valid email id');
            angular.element('#uemail').parents('.fieldholder').css('border-bottom', '1px solid #f00');
            angular.element('#uemail').focus();
            return false;
        } else {
            angular.element("#erroremail").text('');
            angular.element('#uemail').parents('.fieldholder').css('border-bottom', '1px solid #d7e7ec');
            valid++;
        }


        var datau = {
            location: uloc,
            location_lat: location_lat,
            location_lng: location_lng,
            mobile: umob,
            email: uemail,
            code: umobcode,
            flag: $scope.selCodeFlag,
            rechange: '0'
        };
	console.log("form data",datau);
	if(valid==4){
		OTP.getOTP(datau).then(function (response) {
			console.log("OTP",response);
        })
	}
       /* if (valid == 4) {
            $http({
                method: "put",
                url: api_url + 'user',
                data: datau,
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).success(function (data) {
                if (data.message == 'success') {
                    $rootScope.umobile = data.user_details[0].mobile;
                    $rootScope.umcode = data.user_details[0].code;
                    $rootScope.umflag = data.user_details[0].flag;
                    jQuery.fancybox({
                        'href': '#otp',
                        'closeBtn': false,
                        keys: {
                            close: null
                        }
                    });
                } else if (data.message == 'failed') {
                    if (data.user_type == 'email') {
                        angular.element('#erroremail').text('Email Already Exists');
                        angular.element('#uemail').parents('.fieldholder').css('border-bottom', '1px solid #f00');
                        angular.element('#uemail').focus();
                        angular.element('#uemail').val('');
                        return false;
                    } else if (data.user_type == 'mobile') {
                        angular.element('#errorphone').text('Mobile Number Already Exists');
                        angular.element('#umobile').css('border-bottom', '1px solid #f00');
                        angular.element('#umobile').focus();
                        angular.element('#umobile').val('');
                        return false;
                    }
                }
            });
        }*/
    };
}

}]);
    