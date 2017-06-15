angular.module('Happystry.controllers')
    .controller('PostDetailsCtrl', ['$scope','Bookmark','$document', 'comment','Report', 'PostInner', 'postDataUpdate', '$rootScope', 'ViewService', '$timeout', '$state', '$log', '$http', '$q', '$sce', '$filter', '$stateParams', '$compile',
        function ($scope,Bookmark,$document, comment,Report ,PostInner, postDataUpdate, $rootScope, ViewService, $timeout, $state, $log, $http, $q, $sce, $filter, $stateParams, $compile) {
            'use strict';
            ViewService.getFeeds({page: 0}).then(function (response) {
                $scope.getPostData = response.data.Posts;
                $scope.getPromotedData = response.data.Promoted;
            }, function (response) {
            });

            ViewService.getCollections().then(function (response) {
                $scope.getCollectionData = response.data.collections;
            }, function (response) {
            });

            ViewService.getTrendingHashTag().then(function (response) {
                $scope.getTrendingData = response.data.trending;
            }, function (response) {
            });

            $scope.playVideo = function () {
                ViewService.openFancyBox({id: "#videoPop"});
            };

            /*==================== Round circle on feeds ===========================================*/
            $scope.roundProgress = ViewService.roundProgressInitialization();
            $scope.getColor = function () {
                return $scope.gradient ? 'url(#gradient)' : $scope.roundProgress.currentColor;
            };
            /*======================================================================================*/
            $scope.contentLoaded=false;
            $scope.logged_res = false;
            var postId = $stateParams.post_id;
            var page = 0;
            var scroll = true;
            lazyloadingforPostInnerdata();
            function lazyloadingforPostInnerdata(){
                PostInner.getInnerPost(postId, page).then(function successCallback(response) {
                    if (response.data.message === "failed") {
                        $state.go('timeline');
                    } else {
                        $scope.contentLoaded=true;
                        page += 10;
                        scroll = true;
                        if (response.data.logged === false) {
                            $scope.logged_res = true;
                            console.log("login",$scope.logged_res);
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
                        $scope.postdetails.posts[0].description = hashData.join(' ');


                        $scope.similar_feeds = response.data.post.similar_feeds;
                        $scope.totalPosts = response.data.post.similar_feeds.length;
                        angular.forEach($scope.similar_feeds, function (v, k) {
                            var splitRowObject = v.location.split(',');
                            if (splitRowObject.length > 0)
                                $scope.similar_feeds[k].location = splitRowObject[0];
                        });

                        //from desc string taking #tags and inserting anchor tag dynamically
                        //$scope.shareUrl = api_url + "#/postdetails/" + $scope.postdetails.posts[0].post_id;
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
            }

            $scope.bookmark_id=0;

            //comment
            $scope.sendComment = function (postid, event) {
                angular.element('.allmorecmts').show();
                var userComment = angular.element(event.currentTarget).val();
                if (userComment.trim() == "") {
                    return false;
                }
                var postId = postid;
                comment.sendComment(postId, userComment).then(function (res) {
                    PostInner.getInnerPost(postId, page).then(function (response) {
                        postDataUpdate.updateNow(postId);
                        $scope.postdetails = response.data.post;
                        $scope.postdetailsCmts = $scope.postdetails.comments;

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
                        //from desc string taking #tags and inserting anchor tag dynamically
                        $scope.checkcomments = response.data.post.comments.length === 0;
                        if ($scope.postdetails.user_like == 0) {
                            angular.element('.sj_like').find('a').addClass('like');
                        } else {
                            angular.element('.sj_like').find('a').addClass('liked');
                        }
                        if ($scope.postdetails.posts[0].bookmark_flag === 1) {
                            $scope.bookmarked = true;
                        }
                    })
                })
                angular.element(event.currentTarget).val("");
            };
            //edit comment
            $scope.editComment = function (event, commentid) {
                angular.element(event.currentTarget).parents('.post-options').fadeOut();
                var commmentElementParent = angular.element(event.currentTarget).parents('.header-hold').find('.comments');
                var commentElement = commmentElementParent.children('p');
                var comment = commentElement.text();
                commentElement.remove();

                var textArea = angular.element('<textarea ng-keyup="$event.keyCode == 13 && !$event.shiftKey && test(postdetails.posts[0].post_id, $event)"></textarea>');
                textArea.append(document.createTextNode(comment));
                angular.element(event.currentTarget).parents('.header-hold').find('.comments').append(textArea);
                $compile(textArea)($scope);
                $scope.test = function (postid, event) {
                    var newcomment = textArea.val();
                    var para = angular.element('<p></p>');
                    para.append(document.createTextNode(newcomment));
                    angular.element(event.currentTarget).parents('.header-hold').find('.comments').append(para);
                    $compile(para)($scope);
                    textArea.remove();
                    var postId = postid;
                    var commentId = commentid;

                    comment.editComment(postId,commentId,newcomment).then(function(response) {

                        angular.element('.header-hold .post-options').fadeIn();
                    }, function errorCallback(response) {
                    });
                };
            };
            //delete comment
            $scope.deleteComment = function (commentid, event, postid) {
                var commentId = commentid;
                var postId = postid;
               comment.deleteComment(postId,commentId).then(function (response) {
                    postDataUpdate.updateNow(postId);
                    angular.element(event.currentTarget).parents('.header-hold').remove();
                }, function errorCallback(response) {
                });
            }
            //sell comment
            $scope.seeMoreComments = function (postid, event) {

                comment.seeMoreComment(postId).then(function(response) {
                    $scope.postdetailsCmts = response.data.comments.comments;
                    angular.element(event.currentTarget).hide();
                });
            };
            $scope.sendLike = function (postid, event) {
                if ($scope.logged_res == true) {
                    $rootScope.loggin_pop(event);
                } else {
                    var result;
                    var isLikedd = angular.element(event.currentTarget).find('a.like-unlike').hasClass('liked');
                    var likenum = angular.element(event.currentTarget).parents('.like-comment-holder').find('span.likes-comments').text();
                    if (isLikedd) {
                        result = 0;
                        angular.element(event.currentTarget).find('a.like-unlike').removeClass('liked');
                        angular.element(event.currentTarget).find('a.like-unlike').addClass('like');
                        angular.element(event.currentTarget).parents('.like-comment-holder').find('span.likes-comments').text(likenum - 1);
                    } else {
                        result = 1;
                        angular.element(event.currentTarget).find('a.like-unlike').removeClass('like');
                        angular.element(event.currentTarget).find('a.like-unlike').addClass('liked');
                        angular.element(event.currentTarget).parents('.like-comment-holder').find('span.likes-comments').text(+likenum + +1);
                    }
                    var postId = postid;
                    comment.sendLike(postId,result).then(function (res) {
                        postDataUpdate.updateNow(postId);
                    })
                }
            };
            //bookmark

            $scope.bookmark = function (e) {
                console.log($scope.bookmark_id);
                if ($scope.bookmark_id != 0) {
                    Bookmark.deleteBookmark($scope.bookmark_id).then(function (response) {
                        $scope.bookmark_id = 0;
                    });
                } else {
                    Bookmark.saveBookmark(postId).then(function (response) {
                        if (response.data.message == 'success') {
                            $scope.bookmark_id = response.data.bookmark_id;
                        }
                    });
                }
            }
            //report post
            $scope.reportPost = function (postid) {
                var postId = postid;
                Report.reportPost(postId).then(function successCallback(response) {
                    postDataUpdate.updateNow(postId);
                    $.fancybox({
                        'href': '#report-post-cont',
                        'closeBtn': false
                    });
                   $state.go('timeline.post');
                    return false;
                });
            }
            $scope.continueReport = function () {
                $.fancybox('#report-post');
            }


            //delete Post
            $scope.deletePostClk = function () {
                jQuery.fancybox({
                    'href': '#delete-post'
                });
            }
            $scope.deletePost = function (postid) {
                var postId = postid;
               PostInner.deletePost(postId).then(function successCallback(response) {
                    postDataUpdate.updateNow(postId);
                    $.fancybox.close("#delete-post");
                   $state.go('timeline.post')
                }, function errorCallback(response) {});
            }

            //lazy loading
            angular.element($document).on('scroll', function () {
                /* scroll to end */
                var footer_distance = 80;
                var document_height = $(document).height();

                var relative = $('.loadmore-relative').offset().top;

                if (($('.loadmore-relative').isOnScreen() === true || $(this).scrollTop() >= relative) && scroll === true) {
                    console.log("scroll called !!");
                    scroll = false;
                    lazyloadingforPostInnerdata();
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