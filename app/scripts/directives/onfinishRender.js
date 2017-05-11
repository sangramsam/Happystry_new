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

angular.module('Happystry.directives').directive("leadershipPopup", [function () {
    return {
        restrict: "A",
        link: function ($scope, element, attrs) {
            element.bind('click', function () {
                $.fancybox("#leader-board");
            });
        }
    };
}]);