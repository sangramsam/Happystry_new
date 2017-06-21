'use strict';
angular.module('Happystry.services')
    .factory('Location', function ($http) {
        var geo_lat = 0;
        var geo_lng = 0;
        var coorinate = {};
        var locationName = '';

        function getPostionCordinate() {
            return coorinate;
        }

        function getLocationName() {
            return locationName;
        }

        function PositionUpdate(position) {
            //happysty8@gmail.com
            geo_lat = position.coords.latitude;
            geo_lng = position.coords.longitude;
            coorinate.lat = geo_lat;
            coorinate.lng = geo_lng;
            var area = '';
            var city = '';
            var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + geo_lat + "," + geo_lng + "&sensor=true&key=AIzaSyDGqM2CkJ6-iOYasbUGKB807d8Z8KdjoSU";
            $http.get(url)
                .then(function (result) {
                    for (var i = 0; i < result.data.results[0].address_components.length; i++) {
                        for (var b = 0; b < result.data.results[0].address_components[i].types.length; b++) {
                            if ((result.data.results[0].address_components[i].types[1] == "sublocality") && (result.data.results[0].address_components[i].types[2] == "sublocality_level_1")) {
                                area = result.data.results[0].address_components[i];
                                console.log("area",area)
                            }
                            if ((result.data.results[0].address_components[i].types[0] == "locality") && (result.data.results[0].address_components[i].types[1] == "political")) {
                                city = result.data.results[0].address_components[i];
                                console.log("city",city)
                            }
                        }
                    }

                    locationName = area.short_name + ',' + city.short_name;
                    console.log("location service check", locationName);

                });

        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(PositionUpdate, showError, {
                maximumAge: 60000,
                timeout: 7000,
                enableHighAccuracy: true
            });
//                    }
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.log("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.log("An unknown error occurred.");
                    break;
            }
        }

        return {
            getPostionCordinate: getPostionCordinate,
            getLocationName: getLocationName
        };

    });