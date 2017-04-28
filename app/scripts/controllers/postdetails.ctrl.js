angular.module('Happystry.controllers')
  .controller('PostDetailsCtrl', [ '$scope','$rootScope','ViewService', '$timeout', '$state', '$log', '$http','$q','$sce', '$filter', '$stateParams','Settings',
  	function ($scope, $rootScope,ViewService, $timeout, $state, $log,$http,$q,$sce, $filter, $stateParams,Settings) {
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

/*==================== Round circle on feeds ===========================================*/
	$scope.roundProgress = ViewService.roundProgressInitialization();
	$scope.getColor = function () {
	    return $scope.gradient ? 'url(#gradient)' : $scope.roundProgress.currentColor;
	};
/*======================================================================================*/


	var postId = $stateParams.post_id;
	var page = 0;

    $http({
        method: 'GET',
        url: Settings.BASE_URL + '/post/PostInner?post_id=' + postId + '&page=' + page,
        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': "TRR36-PDTHB-9XBHC-PPYQK-GBPKQ"}
    }).then(function successCallback(response) {
        // $scope.resetClose();
        if (response.data.message == "failed") {
            $state.go('timeline');
        } else {
            if (response.data.logged === false) {
                $scope.logged_res = true;
             //   angular.element('#pos_detCmt').attr('disabled', 'disabled');
            }
            $scope.postdetails = response.data.post;
            $scope.postdetailsDesc = $scope.postdetails.posts[0].description;
            $scope.twrpostdetailsDesc = ($scope.postdetails.posts[0].description).substring(0, 50) + (($scope.postdetails.posts[0].description).length > 50 ? '...' : '');
            $scope.postdetailsImg = $scope.postdetails.posts[0].post_image[0];
            $scope.postdetailsLocation = $scope.postdetails.posts[0].location;
            $scope.postdetailsCmts = $scope.postdetails.comments;
            var splitRowObject = $scope.postdetailsLocation.split(',');
            if (splitRowObject.length > 0)
                $scope.postdetailsLocation = splitRowObject[0];
            //from desc string taking #tags and inserting anchor tag dynamically
            var hashData = [];
            var val_desc = ($scope.postdetails.posts[0].description).split(" ");
            angular.forEach(val_desc, function (valdesc, ky) {
                var sds = valdesc.split("\n");
                angular.forEach(sds, function (valsds, k) {
                    var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                    match = re.exec(valsds);
                    if (match) {
                        var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                        $compile(res)($scope);
                        hashData.push(res);
                    } else {
                        hashData.push(valsds);
                    }
                });
            });
            $scope.postdetails.posts[0].description = hashData.join(' ');


            $scope.similar_feeds = response.data.post.similar_feeds;
            $scope.totalPosts = response.data.post.similar_feeds.length;
            angular.forEach($scope.similar_feeds, function (v, k) {
                var splitRowObject = v.location.split(',');
                if (splitRowObject.length > 0)
                    $scope.similar_feeds[k].location = splitRowObject[0];
            });

            //from desc string taking #tags and inserting anchor tag dynamically
            angular.forEach($scope.similar_feeds, function (value, key) {
                var hashData = [];
                var val_desc = (value.description).split(" ");
                angular.forEach(val_desc, function (valdesc, ky) {
                    var sds = valdesc.split("\n");
                    angular.forEach(sds, function (valsds, k) {
                        var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                        match = re.exec(valsds);
                        if (match) {
                            var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                            $compile(res)($scope);
                            hashData.push(res);
                        } else {
                            hashData.push(valsds);
                        }
                    });
                });
                $scope.similar_feeds[key].description = hashData.join(' ');
            });
            //from desc string taking #tags and inserting anchor tag dynamically
            $scope.shareUrl = api_url + "#/postdetails/" + $scope.postdetails.posts[0].post_id;
            $scope.checkcomments = response.data.post.comments.length === 0;
            if ($scope.postdetails.posts[0].user_like === 0) {
                angular.element('.sj_like1').find('a.like-unlike').addClass('like');
            } else {
                angular.element('.sj_like1').find('a.like-unlike').addClass('liked');
            }
            if ($scope.postdetails.posts[0].bookmark_flag === 1) {
                $scope.bookmark_id = $scope.postdetails.posts[0].bookmark_id
                $scope.bookmarked = true;
            }
        }
    }, function errorCallback(response) {
    });

}]);