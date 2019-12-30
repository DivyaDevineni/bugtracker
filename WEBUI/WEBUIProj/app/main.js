(function () {

    define([
        'angular',
        'angularAMD',
        'common/router',
        'angular-ui-router',
        'ngToast',
        'google'
       
    ], function (angular, angularAMD, router) {
        'use strict';

        var app = angular.module('fleetConnect', ['ui.router', 'ui.grid', 'ui.grid.pagination', 'ngToast', 'googleMap'])
            .config(router)

        //.config(function ($httpProvider) {
        //    $httpProvider.defaults.headers.common = {};
        //    $httpProvider.defaults.headers.post = {};
        //    $httpProvider.defaults.headers.put = {};
        //    $httpProvider.defaults.headers.patch = {};
        //});

        return angularAMD.bootstrap(app);
    });



}());

