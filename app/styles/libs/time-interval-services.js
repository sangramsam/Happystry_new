var servicesMod = angular.module('timeIntervalServices', []);

servicesMod.factory('nowTime', ['$timeout',function($timeout) {
  var nowTime = Date.now();
  var updateTime = function() { $timeout(function(){ nowTime = Date.now(); updateTime(); }, 1000); };
  updateTime();
  return function() {
    return nowTime;
  };
}]);

servicesMod.factory('timeAgo', function($timeout) {
    var service = {
      settings: {
        refreshMillis: 60000,
        allowFuture: false,
        strings: {
          prefixAgo: null,
          prefixFromNow: null,
//          suffixAgo: "ago",
          suffixFromNow: "from now",
//          seconds: "less than a minute",
          seconds: "Just now",
          minute: "%d min",
          minutes: "%d mins",
          hour: "%d hour",
          hours: "%d hours",
          day: "%d day",
          days: "%d days",
          month: "%d month",
          months: "%d months",
          year: "%d year",
          years: "%d years",
          numbers: []
        }
      },
      inWords: function(distanceMillis) {
        var $l = service.settings.strings;
        var prefix = $l.prefixAgo;
        var suffix = $l.suffixAgo;
        if (service.settings.allowFuture) {
          if (distanceMillis < 0) {
            prefix = $l.prefixFromNow;
            suffix = $l.suffixFromNow;
          }
        }

        var seconds = Math.abs(distanceMillis) / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var years = days / 365;

        function substitute(stringOrFunction, number) {
          var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
          var value = ($l.numbers && $l.numbers[number]) || number;
          return string.replace(/%d/i, value);
        }

        var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

        var separator = $l.wordSeparator === undefined ?  " " : $l.wordSeparator;
        return $.trim([prefix, words, suffix].join(separator));
      },
    parse: function(iso8601) {
      if (angular.isNumber(iso8601)) return parseInt(iso8601,10);
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
      }
    };
    return service;
});
