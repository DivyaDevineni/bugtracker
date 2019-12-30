var dependencies = ['main', 'common/masterdataFactory', 'profile/profileFactory', 'moment-picker'];
define(dependencies, function (app) {
    app.controller("profileCtrl", function ($scope, $stateParams, $rootScope, $location, profileFactory, ngToast) {
        'use strict';

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }
        var profile = JSON.parse(sessionStorage.getItem('profile'));
        $scope.user_id = profile[0].user_id;

        $scope.model = profileFactory.model();
        $scope.usermodel = profileFactory.usermodel();

        var ongetuserdetailssuccess = function (response) {
            //console.log(JSON.parse(response.data.Message));
            if (response.data) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);
                    console.log("$scope.userlistmodel", $scope.userlistmodel);
                    $scope.model = responsedata[0];
                }
            }
            NProgress.done();
        };



        var ongetuserdetailserror = function (response) {
            console.log(JSON.parse(response.data.Message));
        };

        var onupdatesuccess = function (response) {
            console.log(JSON.stringify(response));
            //NProgress.done();
            ngToast.success('User Updated Successfully');
            if (response.data) {
                if (response.data.Message) {
                    $scope.model = response.data.Message;
                    var response = JSON.parse(response.data.Message);

                    if (sessionStorage.getItem('loginuserid') == response[0].user_id) {
                        sessionStorage.setItem('profile', $scope.model);
                        $scope.$parent.profilepath = response[0].logopath;
                        $scope.$parent.profilename = response[0].user_username;
                    }

                    if ($scope.isemployee || $scope.iscontractor) {
                        $location.path('bug')

                    }
                    else {
                        $location.path('user');
                    }

                }
            }
        };

        var onupdateerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };

        var onChangePasswordSuccess = function (response) {
            console.log(JSON.stringify(response));
            ngToast.success('Password changed Successfully');
            //$location.path('bugList');
            $scope.$parent.Logout();
        };

        var onChangePasswordError = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };


        $scope.Update = function () {
            profileFactory.update($scope.model).then(onupdatesuccess, onupdateerror);
        };

        $scope.changePassword = function (form) {
            if (form.$valid) {
                $scope.usermodel.user_emailid = $scope.model.user_emailid;
                profileFactory.changepassword($scope.usermodel).then(onChangePasswordSuccess, onChangePasswordError);
            }
        };

        var getUserDetails = function () {
            NProgress.start();
            profileFactory.Userdetailsbyid({ "user_id": $scope.user_id }).then(ongetuserdetailssuccess, ongetuserdetailserror);
        };
        getUserDetails();


        // GET THE FILE INFORMATION.
        $scope.getFileDetails = function (e) {

            $scope.files = [];
            $scope.$apply(function () {

                // STORE THE FILE OBJECT IN AN ARRAY.
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
                }

            });
            $scope.uploadFiles();
        };

        // NOW UPLOAD THE FILES.
        $scope.uploadFiles = function () {

            //FILL FormData WITH FILE DETAILS.
            var data = new FormData();

            for (var i in $scope.files) {
                data.append("uploadedFile", $scope.files[i]);
            };

            profileFactory.UploadFoodImages(data, function (resdata) {

                //document.getElementById('FileName').value = resdata;
                //seting return file name to scope logo and imagepath to bind
                // replacing double quotes with empty string
                resdata = resdata.replace(/['"]+/g, '');
                // spliting for logo i.e filename and image path
                $scope.model.user_logo = resdata;
                var values = resdata.split(",");
                $scope.model.user_logo = values[0];
                $scope.model.imgpath = values[1];

                // refreshing the image path to image tag once new image path is loaded.
                $scope.$apply(function () {
                    $scope.userlistmodel.imgpath = values[1];;
                });
            });

        };

    })
});