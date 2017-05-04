angular.module('Happystry.services').service('postDataUpdate', function ($http, $rootScope, ViewService,Settings) {
    return {
        updateNow: function (clickedPostId) {
            return $http({
                method: 'GET',
                url: Settings.BASE_URL + 'post/PostInner?post_id=' + clickedPostId,
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
            }).then(function successCallback(response) {
                if (response.data.message != 'failed') {
                    var hashData = [];
                    var val_desc = (response.data.post.posts[0].description).split(" ");
                    angular.forEach(val_desc, function (valdesc, ky) {
                        var sds = valdesc.split("\n");
                        angular.forEach(sds, function (valsds, k) {
                            var re = /(?:^|\W)#(\w+)(?!\w)/g, match;
                            match = re.exec(valsds);
                            if (match) {
                                var res = match[0].replace(match[0], '<a ng-href="#/search/hashtag/' + match[1] + '" >' + match[0] + '</a>');
                                hashData.push(res);
                            } else {
                                hashData.push(valsds);
                            }
                        });
                    });

                    response.data.post.posts[0].description = hashData.join(' ');
                    if (ViewService.previousPost !== undefined) {
                        angular.forEach(ViewService.previouspromPost, function (vprp, k) {
                            if (clickedPostId === vprp['post_id']) {
                                ViewService.previouspromPost[k] = response.data.post.posts[0];
                            }
                        });
                        angular.forEach(ViewService.previousPost, function (vnrp, vpk) {
                            if (clickedPostId === vnrp['post_id']) {
                                ViewService.previousPost[vpk] = response.data.post.posts[0];
                            }
                        });
                    } else {
                        angular.forEach($rootScope.getPostData, function (rnrp, rgk) {
                            if (clickedPostId === rnrp['post_id']) {
                                $rootScope.getPostData[rgk] = response.data.post.posts[0];
                            }
                        });
                        angular.forEach($rootScope.getPromotedData, function (rprp, rgpk) {
                            if (clickedPostId === rprp['post_id']) {
                                $rootScope.getPromotedData[rgpk] = response.data.post.posts[0];
                            }
                        });
                    }
                } else {
                    if (ViewService.previousPost !== undefined) {
                        angular.forEach(ViewService.previouspromPost, function (vprp, k) {
                            if (clickedPostId === vprp['post_id']) {
                                (ViewService.previouspromPost).splice([k],1);
                            }
                        });
                        angular.forEach(ViewService.previousPost, function (vnrp, vpk) {
                            if (clickedPostId === vnrp['post_id']) {
                                (ViewService.previousPost).splice([vpk],1);
                            }
                        });
                    } else {
                        angular.forEach($rootScope.getPostData, function (rnrp, rgk) {
                            if (clickedPostId === rnrp['post_id']) {
                                ($rootScope.getPostData).splice([rgk],1);
                            }
                        });
                        angular.forEach($rootScope.getPromotedData, function (rprp, rgpk) {
                            if (clickedPostId === rprp['post_id']) {
                                ($rootScope.getPromotedData).splice([rgpk],1);
                            }
                        });
                    }
                }
            }, function errorCallback(response) { });
        }
    }
});