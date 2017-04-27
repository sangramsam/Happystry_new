angular.module('Happystry.directives')
.directive("sidebarDirective", function() {
    return {
    	restrict: 'AE',
      	replace: 'true',
        templateUrl: "app/views/sidebar.html"
    };
}).directive("headerDirective", function() {
    return {
    	restrict: 'AE',
      	replace: 'true',
        templateUrl: "app/views/header.html"
    };
});