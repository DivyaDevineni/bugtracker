var dependencies = ['main', 'login/loginFactory', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app, loginFactory) {
    app.controller("loginCtrl", function ($scope, $stateParams, $rootScope, $location, loginFactory, masterdataFactory, ngToast) {
        'use strict';

        //if (!$scope.$parent.isAuth) {
        //    $location.path("login");
        //    return;
        //}

        $scope.model = loginFactory.model();


        var onLoginSuccess = function (response) {
            console.log("loginoutput : ", response.data);

            if (response.data.Message != "") {

                sessionStorage.setItem('profile', response.data.Message);
                //sessionService.setToken(response.headers().accesstoken);
                try {
                    require.undef('customJs');
                } catch (e) {

                }
                require(['customJs']);
                $rootScope.$emit("Login", {});
            } else {
                //document.getElementById("overlay").style.display = "none";
                ngToast.warning('Invalid Login Credentials !!!');
            }
        };

        var onLoginError = function (response) {
            console.log(JSON.stringify(response));
            //document.getElementById("overlay").style.display = "none";
            ngToast.warning('Invalid Login credentials !!!');
        };

        $scope.signin = function (form) {
            if (form.$valid) {
                //document.getElementById("overlay").style.display = "block";
                console.log("loginmodel", $scope.loginmodel);
                //$location.path('projectList');
                loginFactory.login($scope.model).then(onLoginSuccess, onLoginError);
            } else {
                ngToast.warning('Invalid Login Credentials !!!');
            }
        };

        //$scope.off = function () {
        //    document.getElementById("overlay").style.display = "none";
        //}

    });
});