'use strict';

/**
 * Main module for the applications
 * @namespace Happystry
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 * @version 1.0
 */
angular.module('Happystry', [
    'ui.router',
    'angular-svg-round-progressbar',
    'Happystry.controllers',
    'Happystry.services',
    'Happystry.router',
    'Happystry.directives',
    'Happystry.filters',
    'angular-svg-round-progressbar',
    'ezfb',
    'ngAutocomplete',
    'angularGrid',
    'ngStorage',
    'angular.filter',
    'angular-img-cropper',
    'infinite-scroll'
]).config(function (ezfbProvider) {
    ezfbProvider.setInitParams({
        appId: '312638455759153'
    });
}).run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        var interval = setInterval(function () {
            if (document.readyState == "complete") {
                window.scrollTo(0, 0);
                clearInterval(interval);
            }
        }, 2);
    });
}]);
angular.module('Happystry.controllers', ['ui.bootstrap']);
angular.module('Happystry.directives', ['ui.bootstrap']);
angular.module('Happystry.services', []);
angular.module('Happystry.filters', []);
angular.module('Happystry.router', []);

