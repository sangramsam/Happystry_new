/**
 * Created by appy-tech-18 on 5/5/17.
 */
angular.module('Happystry.controllers').controller('searchController', ['$scope','$window','$document','$stateParams', '$http','ViewService','ViewService2',
function ($scope,$window,$document,$stateParams, $http,ViewService,ViewService2) {
    $scope.allusers = false;
    $scope.allposts = true;
    $scope.allUsers = function (searchVal) {
        angular.element('#autosugg').hide();
        window.location.href = "#/search/query/user/" + searchVal;
    };
    $scope.allPosts = function (searchVal) {
        angular.element('#autosugg').hide();
        window.location.href = "#/search/query/post/" + searchVal;
    };
    $scope.goToProfile = function (uid) {
        angular.element('#autosugg').hide();
        window.location.href = "#/profile/" + uid;
    };
    $scope.postclick = function (id) {
        angular.element('#autosugg').hide();
        window.location.href = "#/postdetails/" + id;
    }
    function resetProperty() {
        $scope.getPostData = [];
        $scope.getPromotedData = [];
    }
//search hashTag
    $scope.page=0;
    $scope.getPostData=[];
    $scope.getPromotedData=[];

    $scope.tag = $stateParams.tag;
    $scope.collection = $stateParams.collection;
    $scope.searchurl=true;
    console.log("search",$scope.tag);
    $scope.SelectedHash =    $scope.tag;
    $scope.SelectedCollection = 'All';
    if($scope.tag){
        resetProperty();
        ViewService.getFilterHashTag( $scope.tag, $scope.page).then(function (response) {
            scroll = true;
            $scope.totalPosts=response.data.post_count;
            $scope.pageFlag += 10;
            $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
            $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);
            //console.log("filter hashTag",$scope.getPostData, $scope.getPromotedData);
        })
    }else if($scope.collection){
        resetProperty();
        ViewService.getFilterCollections($scope.collection, $scope.page).then(function (response) {
            $scope.pageFlag += 10;
            $scope.totalPosts=response.data.post_count;
            $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
            $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);

            //console.log("filter collection",$scope.getPostData, $scope.getPromotedData);
        })
    }

//lazy loading for tag search

    function loadDataHashTagFilter(hash_name) {
        ViewService.getFilterHashTag(hash_name, $scope.pageFlag).then(function (response) {
            scroll = true;
            $scope.pageFlag += 10;
            $scope.totalPosts=response.data.post_count;
            $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
            $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);

        })
    }

}]);



