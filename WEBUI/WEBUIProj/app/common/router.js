define([
    'angularAMD',
    'master/masterCtrl'
], function (angularAMD, masterCtrl) {
    'use strict';
    return function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('fc',
              angularAMD.route({
                  abstract: true,
                  controller: masterCtrl,
                  templateUrl: 'app/master/master.html',
                  controllerAs: 'vm'
              }))
            .state('fc.dashboard',
            angularAMD.route({
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html',
                controllerAs: 'vm',
                controllerUrl: 'dashboard/dashboardCtrl',
                controller: 'dashboardCtrl'
            }))
            //login
            .state('fc.login',
            angularAMD.route({
                url: '/login',
                templateUrl: 'app/login/login.html',
                controllerAs: 'vm',
                controllerUrl: 'login/loginCtrl',
                controller: 'loginCtrl'
            }))
            //forgot password
             .state('fc.forgotpassword',
            angularAMD.route({
                url: '/forgotpassword',
                templateUrl: 'app/login/forgotpassword.html',
                controllerAs: 'vm',
                controllerUrl: 'login/forgotpasswordCtrl',
                controller: 'forgotpasswordCtrl'
            }))
            //change password
             .state('fc.ChangePassword',
            angularAMD.route({
                url: '/ChangePassword',
                templateUrl: 'app/user/ChangePassword.html',
                controllerAs: 'vm',
                controllerUrl: 'user/edituserCtrl',
                controller: 'edituserCtrl'
            }))

            // Sign up
            .state('fc.signup',
            angularAMD.route({
                url: '/signup',
                templateUrl: 'app/login/signup.html',
                controllerAs: 'vm',
                controllerUrl: 'login/signupCtrl',
                controller: 'signupCtrl'
            }))

            //editprofile
             .state('fc.editprofile',
            angularAMD.route({
                url: '/editprofile',
                templateUrl: 'app/login/editprofile.html',
                controllerAs: 'vm',
                controllerUrl: 'login/editprofileCtrl',
                controller: 'editprofileCtrl'
            }))

        .state('fc.home',
            angularAMD.route({
                url: '/home',
                templateUrl: 'app/home/home.html',
                controllerAs: 'vm',
                controllerUrl: 'home/homeCtrl',
                controller: 'homeCtrl'
            }))

            //user
          .state('fc.user',
            angularAMD.route({
                url: '/user',
                templateUrl: 'app/user/user.html',
                controllerAs: 'vm',
                controllerUrl: 'user/userCtrl',
                controller: 'userCtrl'
            }))

             .state('fc.adduser',
            angularAMD.route({
                url: '/adduser',
                templateUrl: 'app/user/adduser.html',
                controllerAs: 'vm',
                controllerUrl: 'user/adduserCtrl',
                controller: 'adduserCtrl'
            }))


         .state('fc.edituser',
            angularAMD.route({
                url: '/edituser/:user_id',
                templateUrl: 'app/user/edituser.html',
                controllerAs: 'vm',
                controllerUrl: 'user/edituserCtrl',
                controller: 'edituserCtrl'
            }))

             .state('fc.deleteuser',
            angularAMD.route({
                url: '/viewuser/:user_id',
                templateUrl: 'app/user/viewuser.html',
                controllerAs: 'vm',
                controllerUrl: 'user/viewuserCtrl',
                controller: 'viewuserCtrl'
            }))


         //report
        .state('fc.status',
            angularAMD.route({
                url: '/status',
                templateUrl: 'app/report/status.html',
                controllerAs: 'vm',
                controllerUrl: 'report/statusCtrl',
                controller: 'statusCtrl'
            }))

        .state('fc.assignee',
            angularAMD.route({
                url: '/assignee',
                templateUrl: 'app/report/assignee.html',
                controllerAs: 'vm',
                controllerUrl: 'report/assigneeCtrl',
                controller: 'assigneeCtrl'
            }))

        .state('fc.reporter',
            angularAMD.route({
                url: '/reporter',
                templateUrl: 'app/report/reporter.html',
                controllerAs: 'vm',
                controllerUrl: 'report/reporterCtrl',
                controller: 'reporterCtrl'
            }))

             .state('fc.Assigneebyuser',
            angularAMD.route({
                url: '/bug/:user_id/:bug_stat_id',
                templateUrl: 'app/bug/bug.html',
                controllerAs: 'vm',
                controllerUrl: 'bug/bugCtrl',
                controller: 'bugCtrl'
            }))

             .state('fc.Statusbyuser',
            angularAMD.route({
                url: '/bug/:bug_stat_id',
                templateUrl: 'app/bug/bug.html',
                controllerAs: 'vm',
                controllerUrl: 'bug/bugCtrl',
                controller: 'bugCtrl'
            }))

             .state('fc.Reporterbyuser',
            angularAMD.route({
                url: '/bug/user/id/:user_id',
                templateUrl: 'app/bug/bug.html',
                controllerAs: 'vm',
                controllerUrl: 'bug/bugCtrl',
                controller: 'bugCtrl'
            }))

        //    .state('fc.bugbyproj',
        //angularAMD.route({
        //    url: '/bug/project/:proj_id',
        //    templateUrl: 'app/bug/bug.html',
        //    controllerAs: 'vm',
        //    controllerUrl: 'bug/bugCtrl',
        //    controller: 'bugCtrl'
        //}))
            // project
            .state('fc.project',
            angularAMD.route({
                url: '/project',
                templateUrl: 'app/project/project.html',
                controllerAs: 'vm',
                controllerUrl: 'project/projectCtrl',
                controller: 'projectCtrl'
            }))

        .state('fc.projectedit',
            angularAMD.route({
                url: '/project/:proj_id',
                templateUrl: 'app/project/project.html',
                controllerAs: 'vm',
                controllerUrl: 'project/projectCtrl',
                controller: 'projectCtrl'
            }))

       //.state('fc.deleteproj',
       //     angularAMD.route({
       //         url: '/projectList/:proj_id',
       //         templateUrl: 'app/project/projectList.html',
       //         controllerAs: 'vm',
       //         controllerUrl: 'project/projectListCtrl',
       //         controller: 'projectListCtrl'
       //     }))
            //projectList

        .state('fc.projectList',
            angularAMD.route({
                url: '/projectList',
                templateUrl: 'app/project/projectList.html',
                controllerAs: 'vm',
                controllerUrl: 'project/projectListCtrl',
                controller: 'projectListCtrl'
            }))

            //bug

        //.state('fc.bugList',
        //    angularAMD.route({
        //        url: '/bugList',
        //        templateUrl: 'app/bug/bugList.html',
        //        controllerAs: 'vm',
        //        controllerUrl: 'bug/bugListCtrl',
        //        controller: 'bugListCtrl'
        //    }))
        //bug

        .state('fc.bug',
            angularAMD.route({
                url: '/bug',
                templateUrl: 'app/bug/bug.html',
                controllerAs: 'vm',
                controllerUrl: 'bug/bugCtrl',
                controller: 'bugCtrl'
            }))


        //Filter

        .state('fc.filter',
            angularAMD.route({
                url: '/filter',
                templateUrl: 'app/bug/filter.html',
                controllerAs: 'vm',
                controllerUrl: 'bug/filterCtrl',
                controller: 'filterCtrl'
            }))

        //Updatebug
        .state('fc.updatebug',
            angularAMD.route({
                url: '/updatebug/:bug_id',
                templateUrl: 'app/bug/updatebug.html',
                controllerAs: 'vm',
                controllerUrl: 'bug/updatebugCtrl',
                controller: 'updatebugCtrl'
            }))

        //module
        .state('fc.module',
            angularAMD.route({
                url: '/module',
                templateUrl: 'app/module/module.html',
                controllerAs: 'vm',
                controllerUrl: 'module/moduleCtrl',
                controller: 'moduleCtrl'
            }))

        //module
        //.state('fc.moduleList',
        //    angularAMD.route({
        //        url: '/moduleList',
        //        templateUrl: 'app/module/moduleList.html',
        //        controllerAs: 'vm',
        //        controllerUrl: 'module/moduleListCtrl',
        //        controller: 'moduleListCtrl'
        //    }))

        //moduleEdit
        .state('fc.moduleEdit',
            angularAMD.route({
                url: '/module/:mod_id',
                templateUrl: 'app/module/module.html',
                controllerAs: 'vm',
                controllerUrl: 'module/moduleCtrl',
                controller: 'moduleCtrl'
            }))

        //profile
        .state('fc.profile',
            angularAMD.route({
                url: '/profile',
                templateUrl: 'app/profile/profile.html',
                controllerAs: 'vm',
                controllerUrl: 'profile/profileCtrl',
                controller: 'profileCtrl'
            }))


        //.state("otherwise", {
        //    url: '',
        //    templateUrl: 'app/login/login.html',
        //    controllerAs: 'vm',
        //    controllerUrl: 'login/loginCtrl',
        //    controller: 'loginCtrl'
        //})

        ;

        $urlRouterProvider.when('', '/login');
        $urlRouterProvider.when('/', '/login');
    };
});




