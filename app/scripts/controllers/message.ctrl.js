angular.module('Happystry.controllers').controller('messagesController', ['$scope','Settings', '$http', '$rootScope', 'msgServices', '$location', function ($scope,Settings, $http, $rootScope, msgServices, $location) {
    //$scope.loggedinUser = $routeParams.id;
//        $rootScope.dataLoaded = false;

    /*if ($routeParams.id != 'msg') {
        if ($routeParams.id != undefined) {
            if (!$scope.logged_res) {
                $http({
                    method: 'GET',
                    url: api_url + "rewards/usersmsg?user_id=" + $routeParams.id,
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                }).then(function successCallback(response) {
                    if (response.data.status == true) {
                        $scope.msgBox = true;
                        $scope.getNotificationDataAll = msgServices.notifyReadFxn(response.data.users.contact[0]);
                        $scope.getMsgContact = response.data.users.contact[0];
                        $scope.getMsgBox = msgServices.msgListFxn(response.data.users.contact[0].messages);
                        angular.element('#user_' + $routeParams.id).addClass('activeEle');
                    }
                    $http({
                        method: 'GET',
                        url: api_url + "rewards/usersmsg",
                        headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                    }).then(function successCallback(response) {
                        if (response.data.logged == false) {

                        } else {
                            $scope.msgnotify = 0;
                            $scope.getNotificationDataAll = msgServices.notifyListFxn(response.data.users.contact);
                            angular.forEach($scope.getNotificationDataAll, function (value, key) {
                                $scope.msgnotify += (value.msgcount != 0) ? 1 : 0;
                            });
                        }

                    }, function errorCallback(response) { });

                }, function errorCallback(response) { });
            }
        }
    }

    $scope.pickMessage = function (usid, ele) {
        $http({
            method: 'GET',
            url: api_url + "rewards/usersmsg?user_id=" + usid,
            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
        }).then(function successCallback(response) {
            if (response.data.status == true) {
                $location.path('/messages/' + usid);
                angular.element('#user_' + usid).addClass('activeEle');
                $scope.msgBox = true;
                $scope.getNotificationDataAll = msgServices.notifyReadFxn(response.data.users.contact[0]);
                $scope.getMsgContact = response.data.users.contact[0];
                $scope.getMsgBox = msgServices.msgListFxn(response.data.users.contact[0].messages);
            }
            $http({
                method: 'GET',
                url: api_url + "rewards/usersmsg",
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                if (response.data.logged == false) {

                } else {
                    $scope.msgnotify = 0;
//            $scope.getNotificationDataAll =[];
                    $scope.getNotificationDataAll = msgServices.notifyListFxn(response.data.users.contact);
                    angular.forEach($scope.getNotificationDataAll, function (value, key) {
                        $scope.msgnotify += (value.msgcount != 0) ? 1 : 0;
                    });
                }
            }, function errorCallback(response) { });

        }, function errorCallback(response) { });
    };
    $scope.msgSendClick = function (msg, yb, cb, $event) {
        if (yb == 1) {
            $scope.blockMsgError = 'You blocked this contact'
        } else if (cb == 1) {

        } else {
            if (msg) {
                $http({
                    method: 'POST',
                    data: {"message": msg, "to_user": $scope.getMsgContact.user_id},
                    url: api_url + "rewards/message",
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                }).then(function successCallback(response) {
                    if (response.data.status == true) {
                        $scope.getMsgBox = msgServices.msgAddFxn(response.data.post_message);
                        $scope.ownMessage = null;
                    }

                }, function errorCallback(response) { });
            } else {

            }
        }

    };
    $scope.viewMsgAll = function () {
        $http({
            method: 'GET',
            url: api_url + "rewards/usersmsg",
            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
        }).then(function successCallback(response) {
            $scope.msgnotify = 0;
//            $scope.getNotificationDataAll =[];
            $scope.getNotificationDataAll = msgServices.notifyListFxn(response.data.users.contact);
            angular.forEach($scope.getNotificationDataAll, function (value, key) {
                $scope.msgnotify += (value.msgcount != 0) ? 1 : 0;
                $location.path('/messages/' + $scope.getNotificationDataAll[0].user_id);
            });
//                $rootScope.dataLoaded = true;
        }, function errorCallback(response) {
            alert('Oops something went wrong with API !!')
        });
    }
    $scope.uBlocked = '';
    $scope.userBlocked = false;
    $scope.msgContBlock = function (b, uid) {
        if (b == 0) {
            $scope.uBlocked = 'Y';
        } else {
            $scope.uBlocked = 'N';
        }
        $http({
            method: 'PUT',
            url: api_url + "rewards/contactblck",
            data: {"to_id": $scope.getMsgContact.user_id, blck: $scope.uBlocked},
            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
        }).then(function successCallback(response) {
            $http({
                method: 'GET',
                url: api_url + "rewards/usersmsg?user_id=" + uid,
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                if (response.data.status == true) {
                    $scope.msgBox = true;
                    $scope.getNotificationDataAll = msgServices.notifyReadFxn(response.data.users.contact[0]);
                    $scope.getMsgContact = response.data.users.contact[0];
                    $scope.getMsgBox = msgServices.msgListFxn(response.data.users.contact[0].messages);
                }
                $http({
                    method: 'GET',
                    url: api_url + "rewards/usersmsg",
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                }).then(function successCallback(response) {
                    $scope.msgnotify = 0;
//            $scope.getNotificationDataAll =[];
                    $scope.getNotificationDataAll = msgServices.notifyListFxn(response.data.users.contact);
                    angular.forEach($scope.getNotificationDataAll, function (value, key) {
                        $scope.msgnotify += (value.msgcount != 0) ? 1 : 0;
                    });
                }, function errorCallback(response) { });

            }, function errorCallback(response) { });

        }, function errorCallback(response) { });
    };
    if (!$scope.logged_res) {
        $http({
            method: 'GET',
            url: api_url + "rewards/usersmsg",
            headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
        }).then(function successCallback(response) {
            if (response.data.logged == false) {

            } else {
                $scope.msgnotify = 0;
//            $scope.getNotificationDataAll =[];
                $scope.getNotificationDataAll = msgServices.notifyListFxn(response.data.users.contact);
                angular.forEach($scope.getNotificationDataAll, function (value, key) {
                    $scope.msgnotify += (value.msgcount != 0) ? 1 : 0;
                });
            }
//            $rootScope.dataLoaded = true;
        }, function errorCallback(response) { });
    }*/
}]);