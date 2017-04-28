angular.module('Happystry.filters', [])
.filter('timeago', function ($filter) {
    return function (input, p_allowFuture) {

        var substitute = function (stringOrFunction, number, strings) {
            var string = angular.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
            var value = (strings.numbers && strings.numbers[number]) || number;
            return string.replace(/%d/i, value);
        },
                nowTime = (new Date()).getTime(),
                date = (new Date(input)).getTime(),
                //refreshMillis= 6e4, //A minute
                allowFuture = p_allowFuture || false,
                strings = {
                    prefixAgo: '',
                    prefixFromNow: '',
                    suffixAgo: "",
                    suffixFromNow: "from now",
                    seconds: "Just now",
                    minute: "1 min",
                    minutes: "%d mins",
                    hour: "1 hr",
                    hours: "%d hrs",
                    day: "1 day",
                    days: "%d days",
                    month: "1 month",
                    months: "%d months",
                    year: "1 year",
                    years: "%d years",
                    decade: "1 decade",
                    decades: "%d decades",
                    century: "1 century",
                    centuries: "%d centuries"
                },
        dateDifference = nowTime - date,
                words,
                seconds = Math.abs(dateDifference) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365,
                decades = years / 10,
                centuries = decades / 10,
                separator = strings.wordSeparator === undefined ? " " : strings.wordSeparator,
                prefix = strings.prefixAgo,
                suffix = strings.suffixAgo;
        if (allowFuture) {
            if (dateDifference < 0) {
                prefix = strings.prefixFromNow;
                suffix = strings.suffixFromNow;
            }
        }

        words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
                seconds < 90 && substitute(strings.minute, 1, strings) ||
                minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
                minutes < 90 && substitute(strings.hour, 1, strings) ||
                hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
                hours < 42 && substitute(strings.day, 1, strings) ||
                days < 30 && substitute(strings.days, Math.round(days), strings) ||
                days < 45 && substitute(strings.month, 1, strings) ||
                days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
                years < 1.5 && substitute(strings.year, 1, strings) ||
                years < 10 && substitute(strings.years, Math.round(years), strings) ||
                decades < 1.5 && substitute(strings.decade, 1, strings) ||
                decades < 10 && substitute(strings.decades, Math.round(decades), strings) ||
                centuries < 1.5 && substitute(strings.century, 1, strings) ||
                substitute(strings.centuries, Math.round(centuries), strings);
        var post_year = $filter('date')(input, 'y');
        var curr_year = $filter('date')(nowTime, 'y');
        if (hours < 24) {
            prefix.replace(/ /g, '')
            words.replace(/ /g, '')
            suffix.replace(/ /g, '')
            return (prefix + ' ' + words + ' ' + suffix + ' ' + separator);
        }
//else if ((hours >= 24) && (hours < 48)){
//return 'Yesterday';
//}
        else if (post_year == curr_year) {
            var today = $filter('date')(input, 'd MMM');
            return today;
        } else {
            var today = $filter('date')(input, 'd MMM, y');
            return today;
        }
    };
});