var directivesMod = angular.module('timeIntervalDirectives', []);
directivesMod.directive('timeAgo', ['timeAgo', 'nowTime', function(timeago, nowTime) {
  return {
    restrict: 'EA',
    link: function(scope, linkElement, attrs) {
      var fromTime;
      
      // Track the fromTime attribute
      attrs.$observe('fromTime', function(value) {
        fromTime = timeago.parse(value);
      });
      
      
      // Track changes to time difference
      scope.$watch(function() { return nowTime() - fromTime; }, function(value) {
        $(linkElement).text(timeago.inWords(value));
      });
    }
  };
}]);

directivesMod.filter('timeAgo', ['timeAgo', 'nowTime', function(timeAgo, nowTime) {
  return function(value) {
    var fromTime = timeAgo.parse(value);
    var diff = nowTime() - fromTime;
    return timeAgo.inWords(diff);
  };
}]);
