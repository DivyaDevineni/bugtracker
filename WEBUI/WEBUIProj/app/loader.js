/// <reference path="E:\Workspaces\FleetConnect\CODE\FleetConnect\FleetConnect.Web\vendor/ngToast/angular-sanitize.js" />
/// <reference path="E:\Workspaces\FleetConnect\CODE\FleetConnect\FleetConnect.Web\vendor/ngToast/ngToast.min.js" />
(function () {

    require.config({
        baseUrl: "app",
        // alias libraries paths.  Must set 'angular'
        paths: {
            'angular': "../vendor/angular/angular.min",
            'angular-ui-router': "../vendor/angular/angular-ui-router",
            'angularAMD': "../vendor/angular/angularAMD.min",
            'angular-cookies': "../vendor/angular/angular-cookies.min",
            'jquery': '../vendor/jquery/jquery.min',
            'jquery-ui': '../vendor/jquery/jqueryui.min',
            'bootstrap': '../vendor/bootstrap/js/bootstrap.min',
            'fastclick': '../vendor/fastclick/fastclick',
            'nprogress': '../vendor/nprogress/nprogress',
            'bootstrapprogressbar': '../vendor/bootstrap-progressbar/bootstrap-progressbar.min',
            'icheck': '../vendor/iCheck/icheck.min',
            'uiGrid': '../vendor/ui-grid/ui-grid',
            //'moment': '../vendor/moment/moment.min',
            //'momentjs': '../vendor/moment/momentWrapper',
            'moment-picker': "../vendor/moment-picker/angular-momentpicker",
            'datarangepicker': '../vendor/bootstrap-datarangepicker/daterangepicker',
            'bootstrap-wysiwyg': '../vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.min',
            'jquery.hotkeys': '../vendor/jquery.hotkeys/jquery.hotkeys',
            'prettify': '../vendor/google-code-prettify/prettify.min',
            'jquery.tagsinput': '../vendor/jquery.tagsinput/jquery.tagsinput',
            'switchery': '../vendor/switchery/switchery.min',
            'select2': '../vendor/select2/js/select2.full.min',
            'parsley': '../vendor/parsleyjs/parsley.min',
            'autosize': '../vendor/autosize/autosize.min',
            'jquery.autocomplete': '../vendor/devbridge-autocomplete/jquery.autocomplete.min',
            'starrr': '../vendor/starrr/starrr',
            'customJs': '../js/custom',
            'ngToast': '../vendor/ngToast/ngToast.min',
            'ngSanitize': '../vendor/ngToast/angular-sanitize',
            'google': '../vendor/google/google',
            'paypalCheckout': 'https://www.paypalobjects.com/api/checkout',
            'angularPayments': '../vendor/angular/angular-payments',
            'pdfmake': '../vendor/report-fileexport/pdfmake',
            'html2canvas': '../vendor/report-fileexport/html2canvas',

        },

        // Add angular modules that does not support AMD out of the box, put it in a shim
        shim: {
            'angular': {
                deps: ['jquery', 'jquery-ui', 'bootstrap', 'icheck'],
                exports: 'angular'
            },
            'pdfmake':{
                deps:['angular'],
                exports:'pdfmake'
            },
            'html2canvas':{
                deps:['angular'],
                exports:'html2canvas'
            },
            'paypalCheckout': {
                deps: ['angular'],
                exports:'paypalCheckout'
            },

            'google': {
                deps: ['angular'],
                exports: 'google'
            },
            'jquery': {

                exports: 'jquery'
            },
            'jquery-ui': {
                deps: ['jquery'],
                exports: 'jquery-ui'
            },
            'bootstrap': {
                deps: ['jquery'],
                exports: 'bootstrap'
            },
            'customJs': {
                deps: ['jquery', , 'bootstrap', 'icheck']
            },
            'icheck': {
                deps: ['jquery'],
                exports: 'icheck'
            },
            'jquery.hotkeys': {
                deps: ['jquery'],
                exports: 'jquery.hotkeys'
            },
            'jquery.tagsinput': {
                deps: ['jquery'],
                exports: 'jquery.tagsinput'
            },
            'select2': {
                deps: ['jquery', 'bootstrap'],
                exports: 'select2'
            },
            'bootstrapprogressbar': {
                deps: ['jquery', 'bootstrap'],
                exports: 'bootstrap'
            },
            'bootstrap-wysiwyg': {
                deps: ['jquery', 'bootstrap'],
                exports: 'bootstrap'
            },
            'bootstrap-wysiwyg': {
                deps: ['jquery', 'bootstrap'],
                exports: 'bootstrap'
            },
            "uiGrid": {
                deps: ['angular'],
                exports: 'uiGrid',
            },
            //'moment': {
            //    deps: ['jquery'],
            //    exports: 'moment'
            //},
            //'momentjs': {
            //    deps: ['moment'],
            //    exports: 'momentjs'
            //},
            'moment-picker': {
                deps: ['angular'],
                exports: 'moment-picker',
            },
            'ngSanitize': {
                deps: ['angular'],
                exports: 'ngSanitize'
            },
            'ngToast': {
                deps: ['angular', 'ngSanitize'],
                exports: 'ngToast',
            },
            'angularAMD': ['angular'],
            'angular-ui-router': ['angular']
            //'angular-cookies': {
            //    deps: ['angular'],
            //    exports: 'angular-cookies',
            //},
        },
        priority: [
            'angular'
        ],
        // kick start application
        deps: ['main'],

    });

}());