angular.module('Happystry.filters').filter("lowercasenospace", function () {
    return function (lowercasenospace) {
        var str = lowercasenospace.replace(/[^A-Z0-9]/ig, "");
        return str.toLowerCase();
    }
});