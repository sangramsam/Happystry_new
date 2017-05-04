angular.module('Happystry.controllers').controller('notificationsController', ['$scope','Settings','$http', '$rootScope', function ($scope,Settings, $http, $rootScope) {
    $http({
        method: 'GET',
        url: Settings.BASE_URL + "rewards/notification?call=1",
        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
    }).then(function successCallback(response) {
        $scope.getNotificationDataAll = response.data.notification;
    }, function errorCallback(response) { });

    $scope.notified = function (n) {
        $http({
            method: 'Put',
            url: Settings.BASE_URL + "rewards/notification",
            data: {notification_id: n.notification_id},
            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
        }).then(function successCallback(response) {
            if (n.event == 'F' || n.event == 'RA' || (n.admin_delete == 0 && n.user_delete == 0)) {
                window.location.href = n.link;
            } else {
                jQuery.fancybox({
                    'href': '#post-deleted'
                });
            }
        });
    }
}]);