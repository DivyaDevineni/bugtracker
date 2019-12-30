var dependencies = ['main', 'bug/bugFactory', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app, bugFactory) {
    app.controller("filterCtrl", function ($scope, $stateParams, $location, bugFactory, masterdataFactory, ngToast) {
        'use strict';
        NProgress.start();
        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        var profile = JSON.parse(sessionStorage.getItem('profile'));
        $scope.statusmodel = {};
        $scope.severitymodel = {};
        $scope.filtermodel = {};
        $scope.buglistmodel = {};
        $scope.bugmodel = {
            "bug_assignedby": profile[0].user_emailid
        };

        // $scope.id = 2;
        //$scope.severity = function (type, id) {

        //    if (type == "severity") {
        //        sessionStorage.setItem('bug_sev_id', id)
        //    }
        //    if (type == "status") {
        //        sessionStorage.setItem('bug_stat_id', id)

        //    }
        //$scope.buglistmodel.sev_id = (type == "severity") ? sessionStorage.setItem('bug_sev_id', id) : $scope.buglistmodel.sev_id;
        //$scope.buglistmodel.stat_id = (type == "status") ? id : $scope.buglistmodel.stat_id;


        //sessionStorage.setItem('bug_stat_id', $scope.buglistmodel.stat_id);



        //load status





        $scope.loadstatus = function () {


            bugFactory.getstatus().then(ongetstatussuccess, ongetstatuserror);
        };

        var ongetstatussuccess = function (response) {

            console.log(" onsuccess getstatus : ", response);
            if (response) {
                if (response.data.Message) {

            $scope.statusmodel = JSON.parse(response.data.Message);
            console.log("$scope.statusmodel  : ", $scope.statusmodel);
            if (sessionStorage.getItem('bug_stat_id')) {
                var bug_stat_id = sessionStorage.getItem('bug_stat_id');
                var statusids = bug_stat_id.split(",");

                for (var i = 0, len = $scope.statusmodel.length; i < len; i++) {
                    var selectedstauts = $scope.statusmodel[i];

                    for (var j = 0; j < statusids.length; j++) {
                        if (selectedstauts.status_id == statusids[j]) {
                            $scope.statusmodel[i].ischecked = true;
                        }
                    }
                }

            }

                }

            }
            NProgress.done();
            //else ($scope.bug_stat_id != "") {

            //    $scope.autocheck();
            //}
        };

        var ongetstatuserror = function (response) {
            console.log("error getstatus : ", response);
        };

        //load severity
        $scope.loadseverity = function () {



            bugFactory.getseverity().then(ongetsevesuccess, ongetseveerror);
        };

        var ongetsevesuccess = function (response) {
            ///console.log(" onsuccess getseverity : ", response);

            $scope.severitymodel = JSON.parse(response.data.Message);
            console.log("$scope.severitymodel  : ", $scope.severitymodel);
            if (sessionStorage.getItem('bug_sev_id')) {
                var bug_sev_id = sessionStorage.getItem('bug_sev_id');
                var seveids = bug_sev_id.split(",");

                for (var i = 0, len = $scope.severitymodel.length; i < len; i++) {
                    var selectedseverity = $scope.severitymodel[i];

                    for (var j = 0; j < seveids.length; j++) {
                        if (selectedseverity.seve_id == seveids[j]) {
                            $scope.severitymodel[i].ischecked = true;
                            var selectedseverity = sessionStorage.getItem('bug_sev_id');
                        }
                    }
                }
            }
            NProgress.done();
        };

        var ongetseveerror = function (response) {
            console.log("error getseverity : ", response);
        };

        //load assignee

        $scope.loadassignee = function () {

            bugFactory.getassignedusers({ "user_proj_id": sessionStorage.getItem('proj_id') }).then(ongetassigneduserssuccess, ongetassigneduserserror);
        };

        var ongetassigneduserssuccess = function (response) {
            console.log(" onsuccess getassignedusers : ", response);

            $scope.assignedUsers = JSON.parse(response.data.Message);
            console.log("$scope.projmodel  : ", $scope.projmodel);

            if (sessionStorage.getItem('bug_assignedto')) {
                var bug_assignedto = sessionStorage.getItem('bug_assignedto');
                var assigneeids = bug_assignedto.split(",");

                for (var i = 0, len = $scope.assignedUsers.length; i < len; i++) {
                    var selectedassignee = $scope.assignedUsers[i];

                    for (var j = 0; j < assigneeids.length; j++) {
                        if (selectedassignee.user_id == assigneeids[j]) {
                            $scope.assignedUsers[i].ischecked = true;
                            var selectedassignee = sessionStorage.getItem('bug_assignedto');
                        }
                    }
                }
            }
            NProgress.done();

        };

        var ongetassigneduserserror = function (response) {

            console.log("error getassignedusers : ", response);
        };





        //sessionStorage.setItem('bug_sev_id', $scope.buglistmodel.sev_id);
        //sessionStorage.setItem('bug_stat_id', $scope.buglistmodel.stat_id);




        $scope.Find = function () {

            sessionStorage.setItem("isfilterenabled", true);

            var statids = "";
            if ($scope.statusmodel) {
                for (var i = 0; i < $scope.statusmodel.length; i++) {
                    if ($scope.statusmodel[i].ischecked == true) {
                        statids = statids + $scope.statusmodel[i].status_id + ",";

                    }
                }
                console.log("$scope.statids :", statids);
                if (statids)
                    statids = statids.substr(0, statids.length - 1)
            }


            sessionStorage.setItem('bug_stat_id', statids);

            var sevids = "";
            if ($scope.severitymodel) {
                for (var i = 0; i < $scope.severitymodel.length; i++) {
                    if ($scope.severitymodel[i].ischecked == true) {
                        sevids = sevids + $scope.severitymodel[i].seve_id + ",";

                    }
                }
                console.log("$scope.sevids :", sevids);
                if (sevids)
                    sevids = sevids.substr(0, sevids.length - 1)
            }
            sessionStorage.setItem('bug_sev_id', sevids);



            var assigneeids = "";
            if ($scope.assignedUsers) {
                for (var i = 0; i < $scope.assignedUsers.length; i++) {
                    if ($scope.assignedUsers[i].ischecked == true) {
                        assigneeids = assigneeids + $scope.assignedUsers[i].user_id + ",";
                    }
                }
                console.log("$scope.assigneeids :", assigneeids);
                if (assigneeids)
                    assigneeids = assigneeids.substr(0, assigneeids.length - 1)
            }

            sessionStorage.setItem('bug_assignedto', assigneeids);

            $location.path('bugList');



        };


        //Filter check from StatusReport
        //$scope.autocheck = function () {
        //    if ($scope.bug_stat_id != "") {
        //        for (var i = 0, len = $scope.statusmodel.length; i < len; i++) {
        //            var selected = $scope.statusmodel[i];
        //            if (selected.status_id == $scope.bug_stat_id) {

        //                $scope.statusmodel[i].ischecked = true;

        //            }
        //        }

        //        $scope.Find();
        //    }
        //}
       

        $scope.Cancel = function () {
            $scope.show = false;
            $scope.btn = false;
            $scope.show1 = true;
            $scope.btn1 = true;
            if (sessionStorage.getItem('bug_stat_id') || sessionStorage.getItem('bug_sev_id') || sessionStorage.getItem('bug_assignedto'))
            {

                sessionStorage.setItem("isfilterenabled", true);
            }
            else
            {
                sessionStorage.setItem("isfilterenabled", false);
            }
            $location.path('bugList');

        };


        $scope.loadstatus();
        $scope.loadseverity();
        $scope.loadassignee();


    });
});