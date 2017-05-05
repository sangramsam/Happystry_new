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
        })
            .state('timeline', {
                url: "/timeline",
                views: {
                    '': {
                        templateUrl: '/app/views/controlDashboard.html'
                    },
                    'body@timeline': {
                        templateUrl:"/app/views/templates/dashboard.html",
                        controller:'autoselect'
                    }

                }

            }).state('timeline.post', {
                views: {
                    '': {
                        templateUrl: '/app/views/controlDashboard.html'
                    },
                    'container@timeline': {
                        templateUrl:"/app/views/templates/timeline.html",
                        controller:'timelineController'
                    }

                }

            })
            .state('postdetails', {
                url: "/postdetails/:post_id",
                templateUrl: "/app/views/postdetails.html",
                title: 'postdetails',
                controller: "PostDetailsCtrl"
            })

        // $urlRouterProvider.otherwise("/");
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    });