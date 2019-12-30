var dependencies = ['main', 'common/apiFactory'];
define(dependencies, function (app) {
    app.factory('profileFactory', function ($http, $httpParamSerializerJQLike, apiFactory) {
        'use strict';

        var model = function () {
            return {
                "user_firstname": "",
                "user_lastname": "",
                "user_username": "",
                "user_emailid": "",
                "user_mobilenumber": "",
                "user_logo": "",
                "user_id": sessionStorage.getItem('loginuserid')
            }
        };

        var usermodel = function () {
            return {
                "user_emailid": "",
                "user_password": "",
                "user_confirmpassword": "",
                "user_id": sessionStorage.getItem('loginuserid')
            }
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

        var changepassword = function (input) {
            return apiFactory.httpPost(apiFactory.baseURL() + "Login/Changepassword", input)
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

            //// UPDATE PROGRESS BAR.
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
            usermodel: usermodel,
            update:update,
            Userdetailsbyid: Userdetailsbyid,
            changepassword:changepassword,
            UploadFoodImages: UploadFoodImages
        };

    });
});