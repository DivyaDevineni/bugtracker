var dependencies = ['main', 'common/apiFactory'];
define(dependencies, function (app) {
    app.factory('dashboardFactory', function ($http, $httpParamSerializerJQLike, apiFactory) {
        'use strict';

        var model = function () {
            return {
                
                "user_id": sessionStorage.getItem('loginuserid')

            }
        };

        var getBugs = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "report/GetBugsDashboard", input)
            .then(function (response) {
                return response;
            });
        };

        var getProjects = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "report/GetProjectsDashboard", input)
            .then(function (response) {
                return response;
            });
        };

        var getSeverity = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "report/GetSeverity", input)
            .then(function (response) {
                return response;
            });
        };





        return {
            model: model,
            getBugs: getBugs,
            getProjects: getProjects,
            getSeverity: getSeverity
           
           

        };

    });
});