angular.module('Happystry.controllers').controller('notificationsController', ['$scope', 'notify', '$state', '$http', '$rootScope',
    function ($scope, notify, $state, $http, $rootScope) {
        $scope.getNo = function () {
            notify.getNotification().then(function (response) {
                $scope.getNotificationDataAll = response.data.notification;
            })
        }
        if ($state.current.name.split('.')[1] === 'notificationViewall') {
            notify.getNotification().then(function (response) {
                $scope.getNotificationDataAll = response.data.notification;
            })
        }
        console.log("state", $state.current.name.split('.')[1]);
        $scope.notified = function (n) {
            notify.notified(n).then(function (resposne) {
                if (n.event == 'F' || n.event == 'RA' || (n.admin_delete == 0 && n.user_delete == 0)) {
                    window.location.href = n.link;
                    //have to work with
                } else {
                    jQuery.fancybox({
                        'href': '#post-deleted'
                    });
                }
            })
        }

    }]);