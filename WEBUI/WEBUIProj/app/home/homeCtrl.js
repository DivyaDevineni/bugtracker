var dependencies = ['main', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app) {
    app.controller("homeCtrl", function ($scope, $stateParams, $rootScope, $location, masterdataFactory, ngToast) {
        'use strict';
        
        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        $scope.home = function () {
            $scope.$parent.isAuth = true;
            $location.path('project');            
        }

        $scope.$parent.isAuth = false;


    })
});