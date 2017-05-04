/**
 * Created by appy-tech-18 on 4/5/17.
 */
angular.module('Happystry.services').factory('getRewards', function ($http,Settings) {
    return {
        getRewardsData: function () {
            return $http({
                method: 'GET',
                url: Settings.BASE_URL + 'rewards',
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
            }).then(function successCallback(response) {
                return response.data.rewards;

            }, function errorCallback(response) {
            });
        }
    }
});