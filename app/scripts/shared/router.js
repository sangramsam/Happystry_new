/**
 * @name Happystry
 * @description
 * # Happystry
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * Main router of the application.
 */

angular.module('Happystry.router', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "/app/views/login.html",
      title:'Login',
      controller:"AuthCtrl"
    });

  $urlRouterProvider.otherwise("/login");
  $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
  });

});