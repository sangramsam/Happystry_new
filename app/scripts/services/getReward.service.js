/**
 * Created by appy-tech-18 on 4/5/17.
 */
angular.module('Happystry.services').factory('getRewards', function ($http,Settings,$q) {
    function getRewardsData() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: Settings.BASE_URL + 'rewards',
            headers: {
                'Content-Type': 'application/json',
                'HAPPI-API-KEY': "TRR36-PDTHB-9XBHC-PPYQK-GBPKQ"
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
    function getRewardsDetail(rewardId) {
        var user_id=localStorage.getItem("user_id");
        var deferred = $q.defer();
        var header='';
        if(user_id){
            header={
                'Content-Type': 'application/json',
                'User-Id':user_id,
                'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
            }
        }else{
            header={
                'Content-Type': 'application/json',
                'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
            }
        }
        $http({
            method: 'GET',
            url: Settings.BASE_URL + 'rewards/rewards_inner?reward_id=' + rewardId,
            headers: header
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
        getRewardsData:getRewardsData,
        getRewardsDetail:getRewardsDetail
    }
});