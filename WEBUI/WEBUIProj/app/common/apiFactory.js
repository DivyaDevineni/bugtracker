
var dependencies = ['main'];
define(dependencies, function (app) {
    app.factory("apiFactory", function ($http) { 

        var baseURL = function () { //main baseurl
            return "http://localhost:54326/api/";
            //http://ec2-52-89-83-54.us-west-2.compute.amazonaws.com:81/api/- test environment
            //http://localhost:54326/api/ --Local environment
        };
        var httpGet = function (url) {
            return $http({
                method: "GET",
                url: url,
                headers: {
                    "Authorization": sessionStorage.getItem('token'),
                    "DeviceName": navigator.userAgent,
                    "AccountUniqueKey": sessionStorage.getItem('accountuniqueid')
                }
            })
            .then(function (response) {
                return response;
            });
        };

        var httpPost = function (url, data) {
            return $http({
                method: "POST",
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": sessionStorage.getItem('token'),
                    "DeviceName": navigator.userAgent,
                    "AccountUniqueKey": sessionStorage.getItem('accountuniqueid')
                }
            })
            .then(function (response) {
                return response;
            });
        };

        var httpGetLogin = function (url, username, password) {
            return $http({
                method: "GET",
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Username': username,
                    'Password': password,
                    "DeviceName": navigator.userAgent
                }
            })
           .then(function (response) {
               return response;
           });
        };



        return {
            baseURL: baseURL,
            httpGet: httpGet,
            httpPost: httpPost,
            httpGetLogin: httpGetLogin
        };

    });
});
