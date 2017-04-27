'use strict';

/**
 * services/auth.service.js
 * ===========
 * This service is created to use provide service to AuthService controller.
 *
 * @class Happystry.services.AuthService
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 */
angular.module('Happystry.services')
.factory('AuthService', function ($http, Settings, $state, $log,$rootScope) {
    function signIn(uname,pass) {
        $.ajax({
            crossDomain: true,
            type: 'POST',
            cache: false,
            url: Settings.BASE_URL + Settings.DO_session,
            data: {
                userid: uname,
                password: pass,
            },
            dataType: 'json',
            success: function (response) {
                localStorage.setItem('token',response.session.token);
                localStorage.setItem('_Account',response.session.token);
                localStorage.setItem('UserName',response.session.username);
                $log.log('success',response);
                $rootScope.isAuthenticated = true;
                $state.go('view');
            },
            error: function (errorType, textStatus, errorThrown) {
            }
        });
    };

  return {
      signIn: signIn
  };

});
