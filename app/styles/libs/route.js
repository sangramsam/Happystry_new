app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
                when('/timeline', {
                    templateUrl: '/home/timeline',
                    controller: 'timelineController'
                }).
                when('/search/collection/:q', {
                    templateUrl: '/home/timeline',
                    controller: 'timelineController'
                }).
                when('/search/collection/:q/:loc', {
                    templateUrl: '/home/timeline',
                    controller: 'timelineController'
                }).
                when('/search/hashtag/:q', {
                    templateUrl: '/home/timeline',
                    controller: 'timelineController'
                }).
                when('/search/query/:q', {
                    templateUrl: '/home/timeline',
                    controller: 'searchController'
                }).
                when('/search/query/user/:q', {
                    templateUrl: '/home/timeline',
                    controller: 'timelineController'
                }).
                when('/search/query/post/:q', {
                    templateUrl: '/home/timeline',
                    controller: 'timelineController'
                }).
                when('/search/:q', {
                    templateUrl: '/home/timeline',
                    controller: 'timelineController'
                }).
                when('/postdetails/:post_id', {
                    templateUrl: '/home/postdetails',
                    controller: 'postdetailsController'
                }).
                when('/profile/:user_id', {
                    templateUrl: '/home/profile',
                    controller: 'userprofileController'
                }).
                when('/profile/:q', {
                    templateUrl: '/home/profile',
                    controller: 'userprofileController'
                }).
                when('/editprofile', {
                    templateUrl: '/home/editprofile',
                    controller: 'editprofileController'
                }).
                when('/rewardsdetails/:reward_id', {
                    templateUrl: '/home/rewardsdetails',
                    controller: 'rewardsdetailsController'
                }).
                when('/rewards', {
                    templateUrl: '/home/rewards',
                    controller: 'rewardsdetailsController'
                }).
                when('/notifications', {
                    templateUrl: '/home/notifications',
                    controller: 'notificationsController'
                }).
                when('/messages/:id', {
                    templateUrl: '/home/messages',
                    controller: 'messagesController'
                }).
                when('/newpost', {
                    templateUrl: '/home/postcreation',
                    controller: 'postcreationController'
                }).
                when('/editpost/:q', {
                    templateUrl: '/home/editpost',
                    controller: 'editpostController'
                }).
                when('/editpost/', {
                    templateUrl: '/home/editpost',
                    controller: 'editpostController'
                }).
                when('/bookmark', {
                    templateUrl: '/home/timeline',
                    controller: 'timelineController'
                }).
                otherwise({
                    redirectTo: 'timeline',
                    controller: 'timelineController'
                });
//        $locationProvider.html5Mode(true);
    }]);