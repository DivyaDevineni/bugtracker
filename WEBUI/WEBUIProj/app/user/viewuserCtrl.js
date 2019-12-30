var dependencies = ['main', 'user/userFactory', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app, userFactory) {
    app.controller("viewuserCtrl", function ($rootScope, $scope, $stateParams, $location, userFactory, masterdataFactory, ngToast) {
        'use strict';

        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        NProgress.start();

        var loginuserid = sessionStorage.getItem('loginuserid');
        console.log("login user id ", loginuserid);

        $scope.user_id = typeof ($stateParams.user_id) == 'undefined' ? '' : $stateParams.user_id;
        if ($scope.user_id == "") { $scope.showhead = true } else { $scope.showhead = false };
        if ($scope.user_id != "") { $scope.showheader = true } else { $scope.showheader = false };

        $scope.userlistmodel = {};
        $scope.usermodel = {};


        $scope.isowner = false;
        //dispaly users based on projid
        var ongetusersbyprojidsuccess = function (response) {
            console.log(" onsuccess getprojectbyuser : ", response);
            if (response) {
                if (response.data.Message) {

                    $scope.userlistmodel = JSON.parse(response.data.Message);
                    $scope.userlistmodel.user_proj_id = $scope.userlistmodel[0].user_proj_id.toString();
                    console.log("$scope.userlistmodel  : ", $scope.userlistmodel);
                    for (var i = 0, len = $scope.userlistmodel.length; i < len; i++) {
                        if ($scope.userlistmodel[i].puser_role != "owner") {
                            $scope.userlistmodel[i].isowner = true;
                            $scope.isowner = true;
                        }
                    }
                    NProgress.done();

                }
            }
        };

        var ongetusersbyprojiderror = function (response) {

            console.log("error getprojectbyuser : ", response);
        };

        var getusers = function () {
            userFactory.getusersbyprojid({ "user_proj_id": sessionStorage.getItem('proj_id') }).then(ongetusersbyprojidsuccess, ongetusersbyprojiderror);
        }







        //delete user
        var ondeletesuccess = function (response) {
            console.log("success deleteuser : ", response);
            ngToast.success('User deleted Successfully');
            getusers();
            $rootScope.$emit("RefreshProjects", {});
        };

        var ondeleteerror = function (response) {
            console.log("error deleteuser : ", response);
        };

        $scope.Delete = function (users, state) {
            console.log('viewuser:', users)
            //$location.path('viewuser/' + users.user_id);
            userFactory.deleteuser({ user_id: users.user_id, user_isactive: state, user_proj_id: sessionStorage.getItem('proj_id') }).then(ondeletesuccess, ondeleteerror);
        };

        getusers();

        //$scope.Edit = function (users) {
        //    console.log('edituser:', users)
        //    $location.path('edituser/' + users.user_id);
        //};
        //$scope.Add = function () {
        //    $location.path('adduser');
        //};




        $scope.addUser = function () {
            $scope.btn = true;
            $scope.btn1 = false;
            $scope.isEdit = false;
            $scope.usermodel = {};
            document.getElementById('userEdit').style.display = "block";
            //$('#userEdit').css('display:block');
        };
        //$(function () {
        //    $('a[href*="#"]:not([href="#"])').click(function () {
        //        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        //            var target = $(this.hash);
        //            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        //            if (target.length) {
        //                $('html, body').animate({
        //                    scrollTop: target.offset().top
        //                }, 1000);
        //                return false;
        //            }
        //        }
        //    });
        //});
        $scope.cancel = function (id, visibility) {
            document.getElementById(id).style.display = visibility;
        };
        $scope.save = function (form) {
            if(form.$valid){
            NProgress.start();

            console.log("usermodel", $scope.usermodel);
            $scope.usermodel.user_isactive = 'true';
            $scope.usermodel.user_creattedby = sessionStorage.getItem('loginuserid');
            $scope.usermodel.user_logo = "default_user_image.jpg";
            $scope.usermodel.user_proj_id = sessionStorage.getItem('proj_id');
            userFactory.insert($scope.usermodel).then(onsuccess, onerror);
            }

        };
        var onsuccess = function (response) {
            // NProgress.done();
            document.getElementById('userEdit').style.display = "none";

            console.log(JSON.stringify(response));
            ngToast.success('User Added Successfully');
            ngToast.success('mail sent successfully');
            $rootScope.$emit("RefreshProjects", {});
            // $location.path('viewuser');
            getusers();

        };

        var onerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };
        $scope.update = function () {

            console.log("usermodel", $scope.usermodel);
            userFactory.update($scope.usermodel).then(onupdatesuccess, onupdateerror);

        };
        var onupdatesuccess = function (response) {
            console.log(JSON.stringify(response));
            //NProgress.done();
            ngToast.success('User Updated Successfully');
            if (response.data) {
                if (response.data.Message) {
                    $scope.usermodel = response.data.Message;
                    var response = JSON.parse(response.data.Message);

                    if (sessionStorage.getItem('loginuserid') == response[0].user_id) {
                        sessionStorage.setItem('profile', $scope.usermodel);
                        $scope.$parent.profilepath = response[0].logopath;
                        $scope.$parent.profilename = response[0].user_username;
                    }

                    //if ($scope.isemployee || $scope.iscontractor) {
                    //    $location.path('bugList')

                    //}
                    //else {
                    //    $location.path('viewuser');
                    //}

                }
            }
            document.getElementById('userEdit').style.display = "none";
            // $rootScope.$emit("RefreshProjects", {});
            getusers();
        };

        var onupdateerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };

        //edit
        var ongetuserdetailssuccess = function (response) {
            $('#userEdit').css('display', 'block');
            //console.log(JSON.parse(response.data.Message));
            if (response.data) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);
                    $scope.usermodel = responsedata[0];

                    console.log("$scope.usermodel", $scope.usermodel);
                }
            }
            NProgress.done();
        };

        var ongetuserdetailserror = function (response) {
            console.log(JSON.parse(response.data.Message));
        };
        NProgress.start();
        $scope.show = true;
        $scope.btn = true;
        $scope.btn1 = false;

        $scope.editUser = function (users) {
            NProgress.start();
            $('#userEdit').css('display', 'none');
            $scope.btn1 = true;
            $scope.btn = false;
            $scope.show = false;
            //if (users.user_id != "") { $scope.showheader = true } else { $scope.showheader = false };
            //if (users.user_id == "") { $scope.showhead = true } else { $scope.showhead = false };
            $scope.isEdit = true;

            $scope.usermodel.user_id = users.user_id.toString();
            userFactory.Userdetailsbyid({ "user_id": $scope.usermodel.user_id }).then(ongetuserdetailssuccess, ongetuserdetailserror);
            //document.getElementById('userEdit').style.display = "block";

        };

    });
});