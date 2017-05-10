angular.module('Happystry.filters').filter("lowercasenospace", function () {
    return function (lowercasenospace) {
        var str = lowercasenospace.replace(/[^A-Z0-9]/ig, "");
        return str.toLowerCase();
    }
});
angular.module('Happystry.filters').filter('reverseOrder', function () {
    return function (items) {
        return items.slice().reverse();
    };
});

