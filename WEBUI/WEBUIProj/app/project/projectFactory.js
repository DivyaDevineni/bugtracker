var dependencies = ['main', 'common/apiFactory'];
define(dependencies, function (app) {
    app.factory('projectFactory', function ($http, $httpParamSerializerJQLike, apiFactory) {
        'use strict';

        var model = function () {
            return {
                "proj_name": "",
                "proj_createdby": "",
                "proj_startdate": "",
                "proj_estimatedenddate": "",
                "proj_description": "",
                "proj_status": active
            }
        };

        var get = function (uniqueid) {
            return apiFactory.httpGet(apiFactory.baseURL() + "driver/" + uniqueid)
            .then(function (response) {
                return response;
            });
        };


         var getprojectsbyuserid = function (input) {
             return apiFactory.httpPost(apiFactory.baseURL() + "project/getprojectsbyuserid", input)
                        .then(function(response) {
                            return response;
                        });
         };

         var gettrashedprojectsbyuserid = function (input) {
             return apiFactory.httpPost(apiFactory.baseURL() + "project/GetTrashedProjByUserId", input)
                        .then(function (response) {
                            return response;
                        });
         };




        var insert = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "project/CreateProject", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var Update = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "project/updateProject", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var activate = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "driver/Activate", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var getProjbyId = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "project/GetProjById", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var deleteproject = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "project/UpdateProjStatus", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var search = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "driver/Search", input)
                        .then(function (response) {
                            return response;
                        });
        };

        // adding file upload factory code
        var UploadFoodImages = function (input, funcallback) {


            var objXhr = new XMLHttpRequest();
            objXhr.addEventListener("progress", updateProgress, false);
            objXhr.addEventListener("load", transferComplete, false);
            objXhr.open("POST", apiFactory.baseURL() + "driver/UploadFiles", input);
            objXhr.onload = function () {
                console.log("File name should be return value", this.responseText);
                funcallback(this.responseText);


            };
            objXhr.send(input);
            //});

            // UPDATE PROGRESS BAR.
            function updateProgress(e) {
                if (e.lengthComputable) {
                    document.getElementById('pro').setAttribute('value', e.loaded);
                    document.getElementById('pro').setAttribute('max', e.total);
                };
            };

            // CONFIRMATION.
            function transferComplete(e) {
                console.log("Files uploaded successfully.");
            };
        };

        return {
            model: model,
            get: get,
            insert: insert,
            Update: Update,
            activate: activate,
            UploadFoodImages: UploadFoodImages,
            search: search,
            gettrashedprojectsbyuserid: gettrashedprojectsbyuserid,
            getprojectsbyuserid: getprojectsbyuserid,
            deleteproject : deleteproject,
            getProjbyId: getProjbyId
        };

    });
});