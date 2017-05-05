angular.module('Happystry.directives').directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$emit(attr.onFinishRender);
            }
        }
    }
});