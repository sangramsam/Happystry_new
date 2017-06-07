angular.module('Happystry.directives').directive("closePopup", [function () {
    return {
        restrict: "A",
        link: function ($scope, element, attrs) {
            element.bind('click', function () {
                jQuery.fancybox.close();
            });
        }
    };
}]);

angular.module('Happystry.directives').directive('icheck', function () {
    return {
        restrict: 'A',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs) {

            element.iCheck({
                checkboxClass: "icheckbox_square-orange"
            });

            element.on('ifChanged', function (event) {
                scope.$apply(function () {
                    scope.ngModel = true;
                });
            });

            element.on('ifUnchecked', function (event) {
                scope.$apply(function () {
                    scope.ngModel = false;
                });
            })
        }
    };
});