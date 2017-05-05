/**
 * Created by appy-tech-18 on 5/5/17.
 */
angular.module('Happystry.controllers').controller('searchController', ['$scope', '$http', function ($scope, $http) {
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
}]);



