
angular.module('Happystry.controllers')
    .controller('aboutUs', ['$scope', '$http', 'userSubscription', '$rootScope', 'Settings', function ($scope, $http, userSubscription, $rootScope, Settings) {
        'use strict';
        $scope.submitSub = function (email) {
            var subEmail = email;
            var valid = 0;
            var propEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            if (subEmail === '') {
                angular.element('#error_email').text('Please enter email id').css('color', 'red').show();
                angular.element("#subscribe").val('');
                angular.element('#subscribe').focus();
                return false;
            } else if (!propEmail.test(subEmail)) {
                angular.element('#error_email').text('Please enter valid email id').css('color', 'red').show();
                angular.element("#subscribe").val('');
                angular.element('#subscribe').focus();
                return false;
            } else {
                angular.element("#error_email").text('');
                valid++;
            }
            if (valid == 1) {
                userSubscription.Subcribe(subEmail).then(function (response) {
                    console.log(response)
                    if (response.data.status) {
                        if (response.data.message === 'success') {
                            angular.element('#error_email').css('color', 'green');
                            angular.element('#error_email').text('Successfully subscribed').show();

                        } else {
                            angular.element('#error_email').text(response.data.type).css('color', 'green').show();
                        }
                    }
                });
            }
        };
    }]);
