/**
 * Created by appy-tech-18 on 4/5/17.
 */
angular.module('Happystry.services').factory('getCollections', function ($http,Settings) {
    return {
        getCollectionsData: function () {
            return $http({
                method: 'GET',
                url: Settings.BASE_URL + 'collections',
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
            }).then(function successCallback(response) {
                return response.data.collections;
            });
        }
    }
});