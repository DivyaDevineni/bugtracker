var dependencies = ['main', 'common/apiFactory'];
define(dependencies, function (app) {
    app.factory('moduleFactory', function ($http, $httpParamSerializerJQLike, apiFactory) {
        'use strict';

        var model = function () {
            return {
                "mod_proj_id": sessionStorage.getItem('proj_id'),
                "mod_name": "",
                "user_id":sessionStorage.getItem('loginuserid'),
                "mod_isactive": ""
            }
        };

        var getprojectsbyuserid = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "project/getprojectsbyuser", input)
                       .then(function (response) {
                           return response;
                       });
        };

        var getmodulesbyuserid = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "module/Modulesbyuser", input)
                       .then(function (response) {
                           return response;
                       });
        };


        var insert = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "module/Createmodule", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var update = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "module/Updatemodule", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var search = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "module/Getmodulesbyproj", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var get = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "module/Getmodulesbyid", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var deactivate = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "module/Deactivate", input)
                        .then(function (response) {
                            return response;
                        });
        };

        //// adding file upload factory code
        //var UploadFoodImages = function (input, funcallback) {


        //    var objXhr = new XMLHttpRequest();
        //    objXhr.addEventListener("progress", updateProgress, false);
        //    objXhr.addEventListener("load", transferComplete, false);
        //    objXhr.open("POST", apiFactory.baseURL() + "driver/UploadFiles", input);
        //    objXhr.onload = function () {
        //        console.log("File name should be return value", this.responseText);
        //        funcallback(this.responseText);


        //    };
        //    objXhr.send(input);
        //    //});

        //    // UPDATE PROGRESS BAR.
        //    function updateProgress(e) {
        //        if (e.lengthComputable) {
        //            document.getElementById('pro').setAttribute('value', e.loaded);
        //            document.getElementById('pro').setAttribute('max', e.total);
        //        };
        //    };

        //    // CONFIRMATION.
        //    function transferComplete(e) {
        //        console.log("Files uploaded successfully.");
        //    };
        //};

        return {
            model: model,
            insert: insert,
            update:update,
            search: search,
            get:get,
            getprojectsbyuserid: getprojectsbyuserid,
            deactivate: deactivate
        };

    });
});