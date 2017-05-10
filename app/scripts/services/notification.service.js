angular.module('Happystry.services').factory('notify', function ($http, Settings, $state, Properties, $log, $q) {
    function getNotification() {
        var deferred = $q.defer();
        var user_id=localStorage.getItem("user_id");
        $http({
            method: 'GET',
            url: Settings.BASE_URL + "rewards/notification?call=1",
            headers: {
                'Content-Type': 'application/json',
                'User-Id':user_id,
                'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
            }
        }).then(function (response, status, headers, config) {
            deferred.resolve({
                status: status,
                data: response.data
            });
        }, function (response, status, headers, config) {
            deferred.reject({
                status: status,
                data: response.data
            });
        });
        return deferred.promise;
    };
    function notified(n) {
        var deferred = $q.defer();
        var user_id=localStorage.getItem("user_id");
        $http({
            method: 'Put',
            url: Settings.BASE_URL + "rewards/notification",
            data: {notification_id: n.notification_id},
            headers: {
                'Content-Type': 'application/json',
                'User-Id':user_id,
                'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
            }
        }).then(function (response, status, headers, config) {
            deferred.resolve({
                status: status,
                data: response.data
            });
        }, function (response, status, headers, config) {
            deferred.reject({
                status: status,
                data: response.data
            });
        });
        return deferred.promise;
    };

    function getMessage() {
        var deferred = $q.defer();
        var user_id=localStorage.getItem("user_id");
        $http({
            method: 'GET',
            url: Settings.BASE_URL + "rewards/usersmsg",
            headers: {
                'Content-Type': 'application/json',
                'User-Id':user_id,
                'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
            }
        }).then(function (response, status, headers, config) {
            deferred.resolve({
                status: status,
                data: response.data
            });
        }, function (response, status, headers, config) {
            deferred.reject({
                status: status,
                data: response.data
            });
        });
        return deferred.promise;
    }
    function getMessagebyId(id) {
        var deferred = $q.defer();
        var user_id=localStorage.getItem("user_id");
        $http({
            method: 'GET',
            url: Settings.BASE_URL + "rewards/usersmsg?user_id=" + id,
            headers: {
                'Content-Type': 'application/json',
                'User-Id':user_id,
                'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
            }
        }).then(function (response, status, headers, config) {
            deferred.resolve({
                status: status,
                data: response.data
            });
        }, function (response, status, headers, config) {
            deferred.reject({
                status: status,
                data: response.data
            });
        });
        return deferred.promise;
    }
    function sendMessagebyId(msg,id) {
        var deferred = $q.defer();
        var user_id=localStorage.getItem("user_id");
        $http({
            method: 'POST',
            data: {"message": msg, "to_user": id},
            url: Settings.BASE_URL + "rewards/message",
            headers: {'Content-Type': 'application/json','User-Id':user_id,
                'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
        }).then(function (response, status, headers, config) {
            deferred.resolve({
                status: status,
                data: response.data
            });
        }, function (response, status, headers, config) {
            deferred.reject({
                status: status,
                data: response.data
            });
        });
        return deferred.promise;
    }
    function blockContact(id,uBlocked) {
        var deferred = $q.defer();
        var user_id=localStorage.getItem("user_id");
        $http({
            method: 'PUT',
            url: Settings.BASE_URL  + "rewards/contactblck",
            data: {"to_id": id, blck:uBlocked},
            headers: {'Content-Type': 'application/json', 'User-Id':user_id,
                'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
        }).then(function (response, status, headers, config) {
            deferred.resolve({
                status: status,
                data: response.data
            });
        }, function (response, status, headers, config) {
            deferred.reject({
                status: status,
                data: response.data
            });
        });
        return deferred.promise;
    }
    return{
        getNotification:getNotification,
        notified:notified,
        getMessage:getMessage,
        getMessagebyId:getMessagebyId,
        sendMessagebyId:sendMessagebyId,
        blockContact:blockContact
    }
});