var dependencies = ['main', 'common/apiFactory'];
define(dependencies, function (app) {
    app.factory('reportFactory', function ($http, $httpParamSerializerJQLike, apiFactory) {
        'use strict';

        var model = function () {
            return {
               // "mod_proj_id": sessionStorage.getItem('proj_id'),
                "status_id":" ",
                "status_name": " ",
                "bug_proj_id": sessionStorage.getItem('proj_id'),
                "proj_id":" ", 
                "bug_stat_id": " ",
                "user_id": sessionStorage.getItem('selectedid')
               
            }
        };

        var assigneereport = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "report/Assigneereport", input)
            .then(function (response) {  
                return response;
            });
        };

        var statusreport = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "report/Statusreport", input)
            .then(function (response) {
                return response;
            });
        };

        var reporterreport = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "report/ReporterReport", input)
            .then(function (response) {
                return response;
            });
        };

        var reporterbyuser = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "report/ReporterByUser", input)
            .then(function (response) {
                return response;
            });
        };

        var statusbyuser = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "report/statusbyuser", input)
            .then(function (response) {
                return response;
            });
        };

      

        return {
            model: model,
            assigneereport: assigneereport,
            statusreport: statusreport,
            reporterreport: reporterreport,
            reporterbyuser: reporterbyuser,
            statusbyuser : statusbyuser
            
        };

    });
});