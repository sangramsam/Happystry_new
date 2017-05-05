/**
 * Created by appy-tech-18 on 5/5/17.
 */
angular.module('Happystry').filter('removeEmptyString', function () {
    return function (input) {
        var newInput = [];
        angular.forEach(input, function (item) {
            if (item != "")
                newInput.push(item);
        });
        return newInput;
    };
});
