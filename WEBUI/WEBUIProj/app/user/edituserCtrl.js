var dependencies = ['main', 'user/userFactory', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app, userFactory) {
    app.controller("edituserCtrl", function ($scope, $stateParams, $location, userFactory, masterdataFactory, ngToast) {
        'use strict';

        var loginuserid = sessionStorage.getItem('loginuserid');
        var profile = JSON.parse(sessionStorage.getItem('profile'));

        console.log("login user id ", loginuserid);
        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        $scope.isemployee = true;
        $scope.iscontractor = true;

        $scope.ismanager = (sessionStorage.getItem('puser_role') == "Manager") ? true : false;
        $scope.isowner = (sessionStorage.getItem('puser_role') == "owner") ? true : false;
       

        if ($scope.ismanager) {
            $scope.isemployee = false;
            $scope.iscontractor = false;
        }

        if ($scope.isowner) {
            $scope.isemployee = false;
            $scope.iscontractor = false;
        }

        $scope.user_id = typeof ($stateParams.user_id) == 'undefined' ? '' : $stateParams.user_id;
        if ($scope.user_id != "") { $scope.isdisable = true } else { $scope.isdisable = false };


        $scope.userlistmodel = {};

        //change password
        $scope.changepassword = function () {

            $location.path('ChangePassword');
        }



        $scope.usermodel = {
            "user_emailid": profile[0].user_emailid
        };

        //change password
        $scope.change = function (form) {
            if (form.$valid) {



                console.log("usermodel", $scope.usermodel);
                //$location.path('projectList');

                userFactory.changepassword($scope.usermodel).then(onsuccess, onerror);
            }
        };

        //edit
        var ongetuserdetailssuccess = function (response) {
            //console.log(JSON.parse(response.data.Message));
            if (response.data) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);
                    $scope.userlistmodel = responsedata[0];

                    console.log("$scope.userlistmodel", $scope.userlistmodel);
                }
            }
        };

        var onsuccess = function (response) {
            console.log(JSON.stringify(response));

            $location.path('bugList');
            ngToast.success('Password changed Successfully');
        };

        var onerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };


        var onupdatesuccess = function (response) {
            console.log(JSON.stringify(response));
            //NProgress.done();
            ngToast.success('User Updated Successfully');
            if (response.data) {
                if (response.data.Message) {
                    $scope.userlistmodel = response.data.Message;
                    var response = JSON.parse(response.data.Message);

                    if (sessionStorage.getItem('loginuserid') == response[0].user_id) {
                        sessionStorage.setItem('profile', $scope.userlistmodel);
                        $scope.$parent.profilepath = response[0].logopath;
                        $scope.$parent.profilename = response[0].user_username;
                    }

                    if ($scope.isemployee||$scope.iscontractor) {
                        $location.path('bugList')

                    }
                    else {
                        $location.path('viewuser');
                    }
                   
                }
            }
        };

        var onupdateerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };
       
        $scope.Update = function () {
            //document.getElementById("overlay").style.display = "block";
            // NProgress.start();
            console.log("userlistmodel", $scope.userlistmodel);
            userFactory.update($scope.userlistmodel).then(onupdatesuccess, onupdateerror);

        };
        $scope.Cancel = function () {
            //sessionStorage.getItem('puser_role');
            
            if ($scope.isemployee||$scope.iscontractor) {
                $location.path('bugList')
            }
            else {
                $location.path('viewuser');
            }
        };



        //edit
        var ongetuserdetailssuccess = function (response) {
            //console.log(JSON.parse(response.data.Message));
            if (response.data) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);
                    $scope.userlistmodel = responsedata[0];

                    console.log("$scope.userlistmodel", $scope.userlistmodel);
                }
            }
            NProgress.done();
        };



        var ongetuserdetailserror = function (response) {
            console.log(JSON.parse(response.data.Message));
        };
        NProgress.start();
        userFactory.Userdetailsbyid({ "user_id": $scope.user_id }).then(ongetuserdetailssuccess, ongetuserdetailserror);


        // adding fileuload code

        // GET THE FILE INFORMATION.
        $scope.getFileDetails = function (e) {

            $scope.files = [];
            $scope.$apply(function () {

                // STORE THE FILE OBJECT IN AN ARRAY.
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
                }

            });
        };



        // NOW UPLOAD THE FILES.
        $scope.uploadFiles = function () {

            //FILL FormData WITH FILE DETAILS.
            var data = new FormData();

            for (var i in $scope.files) {
                data.append("uploadedFile", $scope.files[i]);
            };

            userFactory.UploadFoodImages(data, function (resdata) {

                //document.getElementById('FileName').value = resdata;
                //seting return file name to scope logo and imagepath to bind
                // replacing double quotes with empty string
                resdata = resdata.replace(/['"]+/g, '');
                // spliting for logo i.e filename and image path
                $scope.userlistmodel.user_logo = resdata;
                var values = resdata.split(",");
                $scope.userlistmodel.user_logo = values[0];
                $scope.userlistmodel.imgpath = values[1];

                // refreshing the image path to image tag once new image path is loaded.
                $scope.$apply(function () {
                    $scope.userlistmodel.imgpath = values[1];;
                });







            });

        };


        //display list of projects in dropdown
        //$scope.projmodel = {};
        //$scope.projlistmodel = {};
        //$scope.loadprojects = function () {

        //    userFactory.getprojectsbyuserid({ puser_user_id: sessionStorage.getItem('loginuserid') }).then(ongetsuccess, ongeterror);
        //};
        //var ongetsuccess = function (response) {
        //    console.log(" onsuccess getprojectbyuser : ", response);

        //    $scope.projlistmodel = JSON.parse(response.data.Message);
        //    console.log("$scope.projmodel  : ", $scope.projlistmodel);


        //};

        //var ongeterror = function (response) {
        //    console.log("error getprojectbyuser : ", response);
        //};
        ////on change event for dropdown
        //$scope.onprojectchanged = function () {
        //    //console.log($scope.userlistmodel);

        //    userFactory.getusersbyprojid({ "user_proj_id": $scope.userlistmodel.user_proj_id }).then(ongetusersbyprojidsuccess, ongetusersbyprojiderror);

        //}

        //var ongetusersbyprojidsuccess = function (response) {
        //    console.log(" onsuccess getprojectbyuser : ", response);

        //    $scope.userlistmodel = JSON.parse(response.data.Message);
        //    console.log("$scope.userlistmodel  : ", $scope.userlistmodel);



        //};

        //var ongetusersbyprojiderror = function (response) {

        //    console.log("error getprojectbyuser : ", response);
        //};
        //$scope.loadprojects();


       



    });
});