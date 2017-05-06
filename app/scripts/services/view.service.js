'use strict';

/**
 *services/view.service.js
 * ===========
 * This service is created to use provide service to view controller.
 *
 * @class Happystry.services.ViewService
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 */
angular.module('Happystry.services')
.factory('ViewService', function ($http, Settings, $state, Properties,roundProgressService, $log,$q) {

            var roundProgress = {
                    max             : 100,
                    offset          : 0,
                    timerCurrent    : 0,
                    uploadCurrent   : 0,
                    stroke          : 2,
                    radius          : 20,
                    isSemi          : false,
                    rounded         : false,
                    responsive      : false,
                    clockwise       : true,
                    currentColor    : '#f47354',
                    bgColor         : '#ccc',
                    duration        : 800,
                    currentAnimation: 'easeOutCubic',
                    animationDelay  : 0,
                    animations      : [],
            };
            angular.forEach(roundProgressService.animations, function (value, key) {
                roundProgress.animations.push(key);
            });
            
            function roundProgressInitialization(){
                return roundProgress;
            };


            function getFeeds(args){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL+"post?page="+args.page,
                    headers: {'Content-Type': 'application/json',
                        'HAPPI-API-KEY':'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'
                             // 'HAPPI-API-KEY': "TRR36-PDTHB-9XBHC-PPYQK-GBPKQ"
                    }
                }).then(function (response, status, headers, config) {
                    deferred.resolve({
                        status: status,
                        data: response.data.allPosts
                    });
                },function(response, status, headers, config){
                    deferred.reject({
                        status: status,
                        data: response.data.allPosts
                    });
                });
                return deferred.promise;
            };


            function getCollections(){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL+'collections',
                    headers: {'Content-Type': 'application/json',
                             'HAPPI-API-KEY': "TRR36-PDTHB-9XBHC-PPYQK-GBPKQ"
                    }
                }).then(function (response, status, headers, config) {
                    deferred.resolve({
                        status: status,
                        data: response.data
                    });
                },function(response, status, headers, config){
                    deferred.reject({
                        status: status,
                        data: response.data
                    });
                });
                return deferred.promise;
            }
            function getFilterCollections(searchColl,args){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL+'post/indexweb?collection=' + searchColl + '&'+'page=' + args,
                    headers: {'Content-Type': 'application/json',
                             'HAPPI-API-KEY': "TRR36-PDTHB-9XBHC-PPYQK-GBPKQ"
                    }
                }).then(function (response, status, headers, config) {
                    deferred.resolve({
                        status: status,
                        data: response.data.allPosts
                    });
                },function(response, status, headers, config){
                    deferred.reject({
                        status: status,
                        data: response.data.allPosts
                    });
                });
                return deferred.promise;
            }
            function getFilterHashTag(searchhash,args){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL+'post/indexweb?hashtag=' + searchhash + '&'+'page=' + args,
                    headers: {'Content-Type': 'application/json',
                             'HAPPI-API-KEY': "TRR36-PDTHB-9XBHC-PPYQK-GBPKQ"
                    }
                }).then(function (response, status, headers, config) {
                    deferred.resolve({
                        status: status,
                        data: response.data.allPosts
                    });
                },function(response, status, headers, config){
                    deferred.reject({
                        status: status,
                        data: response.data.allPosts
                    });
                });
                return deferred.promise;
            }

            function getTrendingHashTag(){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: Settings.BASE_URL+'post/trendinghash',
                    headers: {'Content-Type': 'application/json',
                             'HAPPI-API-KEY': "TRR36-PDTHB-9XBHC-PPYQK-GBPKQ"
                    }
                }).then(function (response, status, headers, config) {
                    deferred.resolve({
                        status: status,
                        data: response.data
                    });
                },function(response, status, headers, config){
                    deferred.reject({
                        status: status,
                        data: response.data
                    });
                });
                return deferred.promise;
            }

            function openFancyBox(props){
                jQuery.fancybox({
                    'href': props.id,
                    'closeBtn': true,
                    keys: {
                        close: null
                    }
                });
            }




    return{
        getTrendingHashTag: getTrendingHashTag,
        getCollections: getCollections,
        getFeeds:getFeeds,
        openFancyBox: openFancyBox,
        roundProgressInitialization: roundProgressInitialization,
        getFilterCollections:getFilterCollections,
        getFilterHashTag:getFilterHashTag
    };

});