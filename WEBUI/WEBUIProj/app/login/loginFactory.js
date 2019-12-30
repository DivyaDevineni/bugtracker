var dependencies = ['main', 'common/apiFactory'];
define(dependencies, function (app) {
    app.factory('loginFactory', function ($http, $httpParamSerializerJQLike, apiFactory) {
        'use strict';

        var model = function () {
            return {
                "user_firstname": "",
                "user_lastname": "",
                "user_emailid": "",
                "user_mobilenumber": "",
                "user_password": "",
                 "user_isactive":""
            }
        };


        var insert = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "login/Login", input)
                        .then(function (response) {
                            return response;
                        });
        };


        var signupinsert = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "user/usercreation", input)
                        .then(function (response) {
                            return response;
                        });
        };
        var forgotpassword = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "login/Forgotpassword", input)
                        .then(function (response) {
                            return response;
                        });
        };


        var login = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "login/Login", input)
                        .then(function (response) {
                            return response;
                        });
        };
        // calling apptype API
        var loaduserapptype = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "user/AppType")
                        .then(function (response) {
                            return response;
                        });
        };


        return {
            model:model,
            login: login,
            insert:insert,
            loaduserapptype: loaduserapptype,
            signupinsert: signupinsert,
            forgotpassword: forgotpassword
        };

    });
});