angular.module('Happystry.controllers').controller('rewardsdetailsController', ['$scope','Settings', '$http', '$stateParams', '$log', 'getRewards', '$rootScope','dynamicNotifications',
    function ($scope,Settings, $http, $stateParams, $log, getRewards, $rootScope,dynamicNotifications) {
        $scope.limitSubtext = 75;
        $scope.limitTitle = 26;
        $rootScope.dataLoaded = false;
        var rewardId = $stateParams.id;
        if(rewardId){
            getRewards.getRewardsDetail(rewardId).then(function (response) {
                console.log(response,"reward")
                if (response.data.logged === false) {
                    $scope.logged_res = true;
                } else {
                    $scope.getRewardInnerData = response.data.rewards;
                    $rootScope.dataLoaded = true;
                }
            });
        }else {
            getRewards.getRewardsData().then(function (response) {

                $scope.getRewardsData = response.data.rewards;
                $rootScope.dataLoaded = true;
            });
        }
        $scope.redeemHistory = function () {
            //var userId = 1;
            $http({
                method: 'GET',
                url: Settings.BASE_URL  + 'rewards/rewards_history',
                headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': "TRR36-PDTHB-9XBHC-PPYQK-GBPKQ"}
            }).then(function successCallback(response) {
                $scope.getRedeemHistoryData = response.data.reward_history;
                $rootScope.dataLoaded = true;
            }, function errorCallback(response) {
            });
        };

        dynamicNotifications.notifyNow();

        $scope.history = false;
        $scope.voucher = true;

    }]);






