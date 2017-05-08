angular.module('Happystry.services').service('likeFuntion', function ($http,Settings) {
    return {
        sendLike: function (postid, event) {
            var isLiked = angular.element(event.currentTarget).find('a.like-unlike').hasClass('liked');
            var likenum = angular.element(event.currentTarget).find('span.likes-comments').text();
            if (isLiked) {
                result = 0;
                angular.element(event.currentTarget).find('a.like-unlike').removeClass('liked');
                angular.element(event.currentTarget).find('a.like-unlike').addClass('like');
                angular.element(event.currentTarget).find('span.likes-comments').text(likenum - 1);
            } else {
                result = 1;
                angular.element(event.currentTarget).find('a.like-unlike').removeClass('like');
                angular.element(event.currentTarget).find('a.like-unlike').addClass('liked');
                angular.element(event.currentTarget).find('span.likes-comments').text(+likenum + +1);

            }
            var user_id=localStorage.getItem("user_id");
            var postId = postid;

            return $http({
                method: 'POST',
                url: Settings.BASE_URL + "post/like",
                data: {
                    post_id: postId,
                    like: result
                },
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ',  'User-Id':user_id}
            }).then(function successCallback(response) {
            }, function errorCallback(response) {
            });
        }
    };


});