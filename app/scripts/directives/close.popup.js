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