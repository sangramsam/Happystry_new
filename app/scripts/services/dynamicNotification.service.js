angular.module('Happystry.services').service('dynamicNotifications', function ($http, $rootScope, msgServices,Settings) {
    return {
        notifyNow: function () {
            $http({
                method: 'GET',
                url: Settings.BASE_URL + "rewards/usersmsg",
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
            }).then(function successCallback(response) {
                if (response.data.logged == false) {
                } else {
                    $rootScope.msgnotify1 = 0;
                    $rootScope.getNotificationDataAll1 = msgServices.notifyListFxn(response.data.users.contact);
                    angular.forEach($rootScope.getNotificationDataAll1, function (value, key) {
                        $rootScope.msgnotify1 += (value.msgcount != 0) ? 1 : 0;
                    });
                    if ($rootScope.msgnotify1 != 0) {
                        $('a.message-icon #mybadge').show();
                    }
                }
            }, function errorCallback(response) { });
            return $http({
                method: 'GET',
                url: Settings.BASE_URL + "rewards/notification?call=0",
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
            }).then(function successCallback(response) {
                $rootScope.getNotificationData1 = response.data.notification;
                if ($rootScope.getNotificationData1.length > 0) {
                    $('a.notification-icon #mybadge').show();
                }
                return response.data.notification;
            }, function errorCallback(response) { });
        }
    }
});/**
 * Created by appy-tech-18 on 4/5/17.
 */
