var dependencies = ['main', 'common/apiFactory'];
define(dependencies, function (app) {
    app.factory('userFactory', function ($http, $httpParamSerializerJQLike, apiFactory) {
        'use strict';

        var model = function () {
            return {

                "user_mobilenumber": "",
                "user_logo": "",
                "user_username": "",
                "user_emailid": "",
                "user_usertype": "",
                "user_isactive": true
            }
        };

        var get = function (uniqueid) {
            return apiFactory.httpGet(apiFactory.baseURL() + "driver/" + uniqueid)
            .then(function (response) {
                return response;
            });
        };

        var getusersbyprojid = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "user/UserListByProjectId", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var insert = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "user/Createuser", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var getprojectsbyuserid = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "project/getprojectsbyuserid", input)
                       .then(function (response) {
                           return response;
                       });
        };
        //var getassignedusers = function (input) {
        //    return apiFactory.httpPost(apiFactory.baseURL() + "user/UserListByProjectId", input)
        //                .then(function (response) {
        //                    return response;
        //                });
        //};



        //change password
        var changepassword = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "Login/Changepassword", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var deleteuser = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "user/DeleteUser", input)
                        .then(function (response) {
                            return response;
                        });
        };

        var Userdetailsbyid = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "user/UserDetailsById", input)
                        .then(function (response) {
                            return response;
                        });
        };
        var update = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "user/UpdateUserStatus", input)
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

        var softdelete = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "driver/Delete", input)
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
            // objXhr.addEventListener("progress", updateProgress, false);
            objXhr.addEventListener("load", transferComplete, false);
            objXhr.open("POST", apiFactory.baseURL() + "user/UploadFiles", input);
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
            get: get,
            insert: insert,

            activate: activate,
            softdelete: softdelete,
            UploadFoodImages: UploadFoodImages,
            search: search,
            update: update,
            getusersbyprojid: getusersbyprojid,
            getprojectsbyuserid: getprojectsbyuserid,
            Userdetailsbyid: Userdetailsbyid,
            deleteuser: deleteuser,
            changepassword: changepassword
        };

    });
});