var dependencies = ['main', 'user/userFactory', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app, userFactory) {
    app.controller("adduserCtrl", function ($rootScope, $scope, $stateParams, $location, userFactory, masterdataFactory, ngToast) {
        'use strict';

        var loginuserid = sessionStorage.getItem('loginuserid');
        console.log("login user id ", loginuserid);
        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        $scope.userlistmodel = {};

        $scope.Cancel = function () {
            $location.path('viewuser');
        };
        
        $scope.Add = function (form) {
            if (form.$valid) {
                //document.getElementById("overlay").style.display = "block";
                NProgress.start();
                console.log("userlistmodel", $scope.userlistmodel);
                $scope.userlistmodel.user_isactive = 'true';
                $scope.userlistmodel.user_creattedby = sessionStorage.getItem('loginuserid');
                $scope.userlistmodel.user_logo = "default_user_image.jpg";
                // $scope.usermodel = {};
                //$scope.usermodel = $scope.userlistmodel[0];
                $scope.userlistmodel.user_proj_id = sessionStorage.getItem('proj_id');
                userFactory.insert($scope.userlistmodel).then(onsuccess, onerror);
            }
        };
        var onsuccess = function (response) {
           // NProgress.done();
            console.log(JSON.stringify(response));
            ngToast.success('User Added Successfully');
            ngToast.success('mail sent successfully');
            $rootScope.$emit("RefreshProjects", {});
            $location.path('viewuser');
           
        };

        var onerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };

        //display list of project for dropdown
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

        //    //userFactory.getusersbyprojid({ "user_proj_id": $scope.userlistmodel.user_proj_id }).then(ongetusersbyprojidsuccess, ongetusersbyprojiderror);

        // }

        //    var ongetusersbyprojidsuccess = function (response) {
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