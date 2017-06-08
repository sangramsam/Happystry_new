/**
 * Created by appy-tech-18 on 5/5/17.
 */
angular.module('Happystry.controllers').controller('searchController', ['$scope','$window','$document','$stateParams','$state', '$http','ViewService','ViewService2',
function ($scope,$window,$document,$stateParams,$state, $http,ViewService,ViewService2) {
    $scope.allusers = false;
    $scope.allposts = true;
    $scope.contentLoaded=false;
    function resetProperty() {
        $scope.getPostData = [];
        $scope.getPromotedData = [];
        scroll=true;
    }
//search hashTag
    var scroll=true;
    $scope.pageFlag=0;
    $scope.getPostData=[];
    $scope.getPromotedData=[];
    $scope.totalPosts=0;
    $scope.tag = $stateParams.tag;
    $scope.collection = $stateParams.collection;
    $scope.searchurl=true;
    console.log("search",$scope.tag,$scope.collection);
    $scope.SelectedHash =    $scope.tag;
    $scope.SelectedCollection = 'All';
    if($scope.tag){
        resetProperty();
        ViewService.getFilterHashTag( $scope.tag,$scope.pageFlag).then(function (response) {
            $scope.contentLoaded=true;
            scroll = true;
            $scope.totalPosts=response.data.post_count;
            $scope.pageFlag += 10;
            $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
            $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);
            //console.log("filter hashTag",$scope.getPostData, $scope.getPromotedData);
        })
    }else if($scope.collection){
        $scope.contentLoaded=true;
        resetProperty();
        ViewService.getFilterCollections($scope.collection,$scope.pageFlag).then(function (response) {
            $scope.pageFlag += 10;
            $scope.totalPosts=response.data.post_count;
            $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
            $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);
        })
    }

//lazy loading for search

    function loadDataHashTagFilter(hash_name) {
        ViewService.getFilterHashTag(hash_name, $scope.pageFlag).then(function (response) {
            scroll = true;
            $scope.pageFlag += 10;
            $scope.totalPosts=response.data.post_count;
            $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
            $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);

        })
    }
    function loadDataCollectionFilter(coll_name) {
        ViewService.getFilterCollections(coll_name, $scope.pageFlag).then(function (response) {
            scroll = true;
            $scope.pageFlag += 10;
            $scope.totalPosts=response.data.post_count;
            $scope.getPostData = ($scope.getPostData).concat(response.data.Posts);
            $scope.getPromotedData = ($scope.getPromotedData).concat(response.data.Promoted);

        })
    }
    //lazy loading
    angular.element($document).on('scroll', function () {
        /* scroll to end */
        var footer_distance = 80;
        var document_height = $(document).height();
        console.log("scroll");
        var relative='';
        if($state.current.name.split('.')[2]==='search'){
            var relative = $('.loadmore-relative').offset().top;
        }
        if (($('.loadmore-relative').isOnScreen() === true || $(this).scrollTop() >= relative) && scroll === true &&  ($scope.pageFlag <= $scope.totalPosts)) {
            console.log("scroll called !!");
            scroll = false;
            if ($scope.tag) {
                console.log("inside tag");
                loadDataHashTagFilter($scope.tag);
            } else if($scope.collection) {
                console.log("inside Collection");
                loadDataCollectionFilter($scope.collection);
            }
        }


    });

    $.fn.isOnScreen = function () {
        var win = $(window);

        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };
    $scope.$on('$destroy', function() {
        $document.unbind('scroll');
    });
}]);



