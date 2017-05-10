/**
 * @name Happystry
 * @description
 * # Happystry
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * Main router of the application.
 */

angular.module('Happystry.router', [])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('login', {
            url: "/",
            title: 'Login',
            views: {
                '': {
                    templateUrl: '/app/views/controlDashboard.html'
                },
                'body@login': {
                    templateUrl:  "/app/views/login.html",
                    controller: "AuthCtrl"
                }
            }
        }).state('login.about', {
            url: 'aboutUs',
            views: {
                '': {
                    templateUrl: 'public/shared/controlDashboard.html'
                },
                'body@login': {
                    templateUrl: "/app/views/templates/aboutus.html",
                    controller: 'aboutUs'
                }
            }
        }).state('login.contact', {
            url: 'contact_us',
            views: {
                '': {
                    templateUrl: 'public/shared/controlDashboard.html'
                },
                'body@login': {
                    templateUrl: "/app/views/templates/contactus.html",
                    controller: 'aboutUs'
                }
            }
        }).state('login.term', {
            url: '/terms_condition',
            views: {
                '': {
                    templateUrl: 'public/shared/controlDashboard.html'
                },
                'body@login': {
                    templateUrl: "/app/views/templates/terms.html",
                    controller: 'aboutUs'
                }
            }
        }).state('login.policy', {
            url: '/policy',
            views: {
                '': {
                    templateUrl: 'public/shared/controlDashboard.html'
                },
                'body@login': {
                    templateUrl: "/app/views/templates/policy.html",
                    controller: 'aboutUs'
                }
            }
        })

            .state('timeline', {
                views: {
                    '': {
                        templateUrl: '/app/views/controlDashboard.html'
                    },
                    'body@timeline': {
                        templateUrl:"/app/views/templates/dashboard.html"
                    }

                }

            }).state('timeline.post', {
             url: "/timeline",
                views: {
                    '': {
                        templateUrl: '/app/views/controlDashboard.html'
                    },
                    'container@timeline': {
                        templateUrl:"/app/views/templates/timeline.html",
                        controller:'timelineController'
                    }

                }

            }).state('timeline.reward', {
             url: "/rewards",
                views: {
                    '': {
                        templateUrl: '/app/views/controlDashboard.html'
                    },
                    'container@timeline': {
                        templateUrl:"/app/views/templates/rewards.html",
                        controller:'rewardsdetailsController'
                    }

                }

            }).state('timeline.reward.rewardDetails', {
             url: "/rewardDetails/:id",
                views: {
                    '': {
                        templateUrl: '/app/views/controlDashboard.html'
                    },
                    'container@timeline': {
                        templateUrl:"/app/views/templates/rewardDetails.html",
                        controller:'rewardsdetailsController'
                    }

                }

            })
            .state('timeline.post.search', {
                url: '/search/hashtag/:tag',
                views: {
                    '': {
                        templateUrl: '/app/views/controlDashboard.html'
                    },
                    'container@timeline': {
                        templateUrl:"/app/views/templates/timeline.html",
                        controller:'searchController'
                    }

                }

            }).state('timeline.post.searchCollection', {
                url: '/search/collection/:collection',
                views: {
                    '': {
                        templateUrl: '/app/views/controlDashboard.html'
                    },
                    'container@timeline': {
                        templateUrl:"/app/views/templates/timeline.html",
                        controller:'searchController'
                    }

                }

            })
            .state('postdetails', {
                url: "/postdetails/:post_id",
                templateUrl: "/app/views/postdetails.html",
                title: 'postdetails',
                controller: "PostDetailsCtrl"
            })

        $urlRouterProvider.otherwise("/");
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    });