var dependencies = ['main', 'login/loginFactory', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app, loginFactory) {
    app.controller("signupCtrl", function ($scope, $stateParams, $location, loginFactory, masterdataFactory, ngToast) {
        'use strict';

        $scope.log = function () {
            $location.path('login');
        }

        $scope.model = loginFactory.model();

        $scope.signup = function (form) {
            if (form.$valid) {

                console.log("model", $scope.model);
                $scope.model.user_isactive = 'true';
                $scope.model.user_logo = "default_user_image.jpg";

                loginFactory.signupinsert($scope.model).then(onsuccess, onerror);
            }
        };

        var onsuccess = function (response) {
            console.log(JSON.stringify(response));
            ngToast.success('SignUp Successfull');
            ngToast.success('mail sent successfully');
            $location.path("login");

        };

        var onerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };
    });
});