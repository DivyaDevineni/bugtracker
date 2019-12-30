var dependencies = ['main', 'common/apiFactory'];
define(dependencies, function (app) {
    app.factory('bugFactory', function ($http, $httpParamSerializerJQLike, apiFactory) {
        'use strict';

        var model = function () {
            return {
                "uniqueid": "",
                "ores_name": "",
                "name": "",
                "desc": "",
                "mobileno": "",
                "logo": "",
                "address": "",
                "licenseno": "",
                "issuedate": "",
                "expirydate": "",
                "ores_uniqueid": "",
                "ores_parent_uniqueid": "",
                "isactive": true
            }
        };


        var getstatus = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "user/GetStatus")
            .then(function (response) {
                return response;
            });
        };

        var getfilterstatus = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "user/GetStatus")
            .then(function (response) {
                return response;
            });
        };



        var getseverity = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "user/GetSeverity")
            .then(function (response) {
                return response;
            });
        };
        var getmodule = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "module/Getmodulesbyproj", input)
            .then(function (response) {
                return response;
            });
        };
        //var getbugmodule = function (input) {
        //    return apiFactory.httpPost(apiFactory.baseURL() + "module/Getmodulesbyproj", input)
        //    .then(function (response) {
        //        return response;
        //    });
        //};
        var getbuglistbyprojid = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/BugList", input)
                       .then(function (response) {
                           return response;
                       });
        };

        var get_total_buglistbyprojid = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/BugList_total", input)
                       .then(function (response) {
                           return response;
                       });
        };

        var getprojectsbyuserid = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "project/getprojectsbyuser", input)
                       .then(function (response) {
                           return response;
                       });
        };


        var insert = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/Createbug", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var getassignedusers = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "user/UserListByProjectId", input)
                        .then(function (response) {
                            return response;
                        });
        };



        var getbuglist = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/BugList", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var getbugdetailsbyid = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/BugListByBugid", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var getbuglistbyfilter = function (input) {

            return apiFactory.httpPost(apiFactory.baseURL() + "bug/BugListByFilter", input)
                        .then(function (response) {
                            return response;
                        });
        };
        var update = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/UpdateBug", input)
                        .then(function (response) {
                            return response;
                        });
        };
        var updatecomment = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/UpdateComment", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var comment = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/CreateComment", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var getComments = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/CommentsByBugid", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var getHistory = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/getBughistory", input)
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

        var sendmail = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "bug/EmailNotification", input)
                        .then(function (response) {
                            return response;
                        });
        };


        // adding file upload factory code



        var UploadFoodImages = function (input, funcallback) {


            var objXhr = new XMLHttpRequest();
            // objXhr.addEventListener("progress", updateProgress, false);
            objXhr.addEventListener("load", transferComplete, false);
            objXhr.open("POST", apiFactory.baseURL() + "bug/UploadFiles", input);
            objXhr.onload = function () {
                console.log("File name should be return value", this.responseText);
                funcallback(this.responseText);


            };
            objXhr.send(input);
            //});

            // UPDATE PROGRESS BAR.
            //function updateProgress(e) {
            //    if (e.lengthComputable) {
            //        document.getElementById('pro').setAttribute('value', e.loaded);
            //        document.getElementById('pro').setAttribute('max', e.total);
            //    };
            //};

            // CONFIRMATION.
            function transferComplete(e) {
                console.log("Files uploaded successfully.");
            };

        };

        var UploadFoodImages1 = function (input, funcallback) {


            var objXhr = new XMLHttpRequest();
            // objXhr.addEventListener("progress", updateProgress, false);
            objXhr.addEventListener("load", transferComplete, false);
            objXhr.open("POST", apiFactory.baseURL() + "bug/UploadFiles", input);
            objXhr.onload = function () {
                console.log("File name should be return value", this.responseText);
                funcallback(this.responseText);


            };
            objXhr.send(input);
            //});

            // UPDATE PROGRESS BAR.
            //function updateProgress(e) {
            //    if (e.lengthComputable) {
            //        document.getElementById('pro').setAttribute('value', e.loaded);
            //        document.getElementById('pro').setAttribute('max', e.total);
            //    };
            //};

            // CONFIRMATION.
            function transferComplete(e) {
                console.log("Files uploaded successfully.");
            };

        };
        return {
            model: model,
            insert: insert,
            update: update,
            UploadFoodImages: UploadFoodImages,
            UploadFoodImages1: UploadFoodImages1,
            getbuglistbyprojid: getbuglistbyprojid,

            getprojectsbyuserid: getprojectsbyuserid,
            getassignedusers: getassignedusers,
            getbuglist: getbuglist,
            getstatus: getstatus,
            getfilterstatus: getfilterstatus,
            getseverity: getseverity,
            getbugdetailsbyid: getbugdetailsbyid,
            getmodule: getmodule,
            //getbugmodule:getbugmodule,
            reporterbyuser: reporterbyuser,
            statusbyuser: statusbyuser,
            comment: comment,
            getComments: getComments,
            getHistory: getHistory,
            sendmail: sendmail,
            getbuglistbyfilter: getbuglistbyfilter,
            get_total_buglistbyprojid: get_total_buglistbyprojid,
            updatecomment: updatecomment



        };

    });
});