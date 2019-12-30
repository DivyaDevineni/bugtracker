var dependencies = ['main', 'login/loginFactory', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app, loginFactory) {
    app.controller("forgotpasswordCtrl", function ($scope, $stateParams, $location, loginFactory, masterdataFactory, ngToast) {
        'use strict';

        //$scope.log = function () {
        //    $location.path('login');
        //}

        $scope.model = {};

        var onsuccess = function (response) {
            console.log(JSON.stringify(response));
            $location.path("login");

        };

        var onerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };

        $scope.Submit = function (form) {
            if (form.$valid) {
                console.log("model", $scope.model);

                loginFactory.forgotpassword($scope.model).then(onsuccess, onerror);
            }
        };
    });
});