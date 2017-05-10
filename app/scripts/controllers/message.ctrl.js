angular.module('Happystry.controllers').controller('messagesController', ['$scope', 'notify', 'Settings', '$http', '$rootScope', 'msgServices', '$location', '$stateParams',
    function ($scope, notify, Settings, $http, $rootScope, msgServices, $location, $stateParams) {
        var user_id = localStorage.getItem("user_id");
        var usid = $stateParams.id;
        if ($stateParams.id) {
            notify.getMessagebyId(usid).then(function (response) {
                if (response.data.status === true) {
                    $scope.msgBox = true;
                    $scope.getNotificationDataAll = msgServices.notifyReadFxn(response.data.users.contact[0]);
                    $scope.getMsgContact = response.data.users.contact[0];
                    $scope.getMsgBox = msgServices.msgListFxn(response.data.users.contact[0].messages);
                }
                notify.getMessage().then(function successCallback(response) {
                    if (response.data.logged == false) {
                    } else {
                        $scope.msgnotify = 0;
                        var getNotificationDataAll = msgServices.notifyListFxn(response.data.users.contact);
                        angular.forEach(getNotificationDataAll, function (value, key) {
                            $scope.msgnotify += (value.msgcount != 0) ? 1 : 0;
                        });
                    }
                    angular.element('#user_' + usid).addClass('activeEle');
                }, function errorCallback(response) {
                });

            }, function errorCallback(response) {
            });
        }
        else {
            console.log("called else")
            notify.getMessage().then(function (response) {
                if (response.data.logged == false) {
                } else {
                    $scope.msgnotify = 0;
                    $scope.getNotificationDataAll = msgServices.notifyListFxn(response.data.users.contact);
                    angular.forEach($scope.getNotificationDataAll, function (value, key) {
                        $scope.msgnotify += (value.msgcount != 0) ? 1 : 0;
                    });
                }

            }, function errorCallback(response) {
            });
        }
        $scope.msgSendClick = function (msg, yb, cb, $event) {
            if (yb == 1) {
                $scope.blockMsgError = 'You blocked this contact'
            } else if (cb == 1) {

            } else {
                if (msg) {
                    notify.sendMessagebyId(msg, $scope.getMsgContact.user_id).then(function (response) {
                        if (response.data.status == true) {
                            $scope.getMsgBox = msgServices.msgAddFxn(response.data.post_message);
                            $scope.ownMessage = null;
                        }

                    })
                } else {

                }
            }

        };
        $scope.uBlocked = '';
        $scope.userBlocked = false;
        $scope.msgContBlock = function (b, uid) {
            if (b == 0) {
                $scope.uBlocked = 'Y';
            } else {
                $scope.uBlocked = 'N';
            }
            notify.blockContact($scope.getMsgContact.user_id, $scope.uBlocked).then(function successCallback(response) {
                notify.getMessagebyId(uid).then(function (response) {
                    if (response.data.status == true) {
                        $scope.msgBox = true;
                        $scope.getNotificationDataAll = msgServices.notifyReadFxn(response.data.users.contact[0]);
                        $scope.getMsgContact = response.data.users.contact[0];
                        $scope.getMsgBox = msgServices.msgListFxn(response.data.users.contact[0].messages);
                    }
                    notify.getMessage().then(function successCallback(response) {
                        $scope.msgnotify = 0;
//                      $scope.getNotificationDataAll =[];
                        $scope.getNotificationDataAll = msgServices.notifyListFxn(response.data.users.contact);
                        angular.forEach($scope.getNotificationDataAll, function (value, key) {
                            $scope.msgnotify += (value.msgcount != 0) ? 1 : 0;
                        });
                    }, function errorCallback(response) {
                    });

                }, function errorCallback(response) {
                });

            }, function errorCallback(response) {
            });
        };

    }]);