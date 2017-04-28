angular.module('Happystry.directives')
.directive('myPosts', function () {
    return {
        restrict: 'A',
        templateUrl: 'app/views/directive_template/posts.html',
        scope: false
    };
})
.directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                return scope.$eval(attrs.compile);
            },
            function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        )
    };
}]);