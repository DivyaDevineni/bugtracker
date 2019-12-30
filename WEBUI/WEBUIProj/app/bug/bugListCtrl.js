var dependencies = ['main', 'bug/bugFactory'];
define(dependencies, function (app, bugFactory) {
    app.controller("bugListCtrl", function ($scope,$window, $stateParams, $location, ngToast, bugFactory) {
        'use strict';

        var loginuserid = sessionStorage.getItem('loginuserid');
        console.log("login user id ", loginuserid);
        var profile = JSON.parse(sessionStorage.getItem('profile'));
        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        //if (!$scope.$parent.isAuth) {
        //    $location.path("login");
        //    return;
        //}


        $scope.bug_id = typeof ($stateParams.bug_id) == 'undefined' ? '' : $stateParams.bug_id;
        $scope.user_id = typeof ($stateParams.user_id) == 'undefined' ? '' : $stateParams.user_id;
        $scope.bug_stat_id = typeof ($stateParams.bug_stat_id) == 'undefined' ? '' : $stateParams.bug_stat_id;
        if (sessionStorage.getItem('selectedproj')) { $scope.list = true } else { $scope.list = false };



        $scope.bugmodel = {};
        $scope.buglistmodel = {};
        $scope.projmodel = {};

        NProgress.start();

        // defining page size manually
        $scope.pagesize = 10;
        //  passing the paging options to ui-grid
        //   $scope.totalPages = 5;
        $scope.pageNo = 1;
        $scope.searchText = '';
        $scope.state = true;
        $scope.enableNextPage = $scope.totalPages - $scope.currentPage > 0;
        $scope.enablePrevPage = $scope.currentPage > 1;

        //Go for next page in ui-grid
        $scope.nextPage = function () {
            $scope.pageNo++;
            $scope.enableNextPage = $scope.totalPages - $scope.pageNo > 0;
            $scope.enablePrevPage = $scope.pageNo > 1;
            $scope.Find();
            // $scope.ClearFilter();
        };

        //Go for Previous page in ui-grid
        $scope.prevPage = function () {
            $scope.pageNo--;
            $scope.enableNextPage = $scope.totalPages - $scope.pageNo > 0;
            $scope.enablePrevPage = $scope.pageNo > 1;
            $scope.Find();
            // $scope.ClearFilter();
        };
        $scope.nextPage1 = function () {
            $scope.pageNo++;
            $scope.enableNextPage = $scope.totalPages - $scope.pageNo > 0;
            $scope.enablePrevPage = $scope.pageNo > 1;

            $scope.ClearFilter();
        };

        //Go for Previous page in ui-grid
        $scope.prevPage1 = function () {
            $scope.pageNo--;
            $scope.enableNextPage = $scope.totalPages - $scope.pageNo > 0;
            $scope.enablePrevPage = $scope.pageNo > 1;

            $scope.ClearFilter();
        };




        //edit bug
        $scope.edit = function (bug) {

            console.log('updatebug:', bug)
            $location.path('updatebug/' + bug.bug_id);
        };


        $scope.isfiltersapplied = false;


        //on getbuglist success
        var ongetbuglistssuccess = function (response) {
            console.log(" onsuccess getbuglist : ", response);

            if (response.data) {

                if (response.data.Message) {

                    $scope.buglistmodel = JSON.parse(response.data.Message);

                    for (var i = 0; i < $scope.buglistmodel.length; i++) {
                        $scope.buglistmodel[i].bug_stat_id = $scope.buglistmodel[i].bug_stat_id.toString();
                        $scope.buglistmodel[i].bug_pstat_id = $scope.buglistmodel[i].bug_stat_id;

                    }

                    console.log("$scope.buglistmodel  : ", $scope.buglistmodel);

                    $scope.getStyle = function (status) {
                        if (status == 1)
                            return { 'background-color': '#dc3912', 'color': 'white' };
                        else if (status == 2)
                            return { 'background-color': '#ff9900', 'color': 'white' };
                        else if (status == 3)
                            return { 'background-color': '#109618', 'color': 'white' };
                        else if (status == 4)
                            return { 'background-color': '#990099', 'color': 'white' };
                        else if (status == 5)
                            return { 'background-color': '#0099c6', 'color': 'white' };
                        else if (status == 6)
                            return { 'background-color': '#66aa00', 'color': 'white' };
                        else if (status == 7)
                            return { 'background-color': '#dd4477', 'color': 'white' };


                    };
                    $scope.totalPages = 1;
                    $scope.enableNextPage = true;
                    $scope.enablePrevPage = $scope.pageNo > 1;

                    if (JSON.parse(response.data.Message).length != $scope.pagesize) {
                        $scope.enableNextPage = false;
                        //sessionStorage.removeItem('selectedproj');
                    }
                    //if (sessionStorage.getItem('selectedproj')) {
                    //    sessionStorage.removeItem('selectedproj');
                    //}
                    NProgress.done();
                }
                else
                    NProgress.done();

            }

        };


        //onget buglist error
        var ongetbuglisterror = function (response) {

            console.log("error getbuglist : ", response);
        };


        var ongetlistssuccess = function (response) {
            console.log(" ongetlistssuccess : ", response);

            if (response.data) {
                if (response.data.Message1) {
                    $scope.listmodel = JSON.parse(response.data.Message1);
                    for (var i = 0; i < $scope.listmodel.length; i++) {
                        $scope.listmodel[i].bug_stat_id = $scope.listmodel[i].bug_stat_id.toString();
                    }

                    console.log("$scope.listmodel  : ", $scope.listmodel);

                    $scope.getStyle = function (status) {
                        if (status == 1)
                            return { 'background-color': '#dc3912', 'color': 'white' };
                        else if (status == 2)
                            return { 'background-color': '#ff9900', 'color': 'white' };
                        else if (status == 3)
                            return { 'background-color': '#109618', 'color': 'white' };
                        else if (status == 4)
                            return { 'background-color': '#990099', 'color': 'white' };
                        else if (status == 5)
                            return { 'background-color': '#0099c6', 'color': 'white' };
                        else if (status == 6)
                            return { 'background-color': '#66aa00', 'color': 'white' };
                        else if (status == 7)
                            return { 'background-color': '#dd4477', 'color': 'white' };


                    };
                    //    $scope.totalPages = 1;
                    //    $scope.enableNextPage = true;
                    //    $scope.enablePrevPage = $scope.pageNo > 1;

                    //    if (JSON.parse(response.data.Message).length != $scope.pagesize) {
                    //        $scope.enableNextPage = false;
                    //    }

                    //    if (sessionStorage.getItem('selectedproj')) {
                    //        sessionStorage.removeItem('selectedproj');
                    //    }
                }
            }
        };


        var ongetlisterror = function (response) {

            console.log("ongetlisterror : ", response);
        };


        var ongetfilterlistssuccess = function (response) {
            console.log(" ongetfilterlistssuccess : ", response);

            if (response.data) {

                if (response.data.Message1) {

                    $scope.listmodel = JSON.parse(response.data.Message1);

                    for (var i = 0; i < $scope.listmodel.length; i++) {
                        $scope.listmodel[i].bug_stat_id = $scope.listmodel[i].bug_stat_id.toString();
                    }

                    console.log("$scope.listmodel  : ", $scope.listmodel);

                    $scope.getStyle = function (status) {
                        if (status == 1)
                            return { 'background-color': '#dc3912', 'color': 'white' };
                        else if (status == 2)
                            return { 'background-color': '#ff9900', 'color': 'white' };
                        else if (status == 3)
                            return { 'background-color': '#109618', 'color': 'white' };
                        else if (status == 4)
                            return { 'background-color': '#990099', 'color': 'white' };
                        else if (status == 5)
                            return { 'background-color': '#0099c6', 'color': 'white' };
                        else if (status == 6)
                            return { 'background-color': '#66aa00', 'color': 'white' };
                        else if (status == 7)
                            return { 'background-color': '#dd4477', 'color': 'white' };


                    };
                    //$scope.totalPages = 1;
                    //$scope.enableNextPage = true;
                    //$scope.enablePrevPage = $scope.pageNo > 1;

                    //if (JSON.parse(response.data.Message1).length != $scope.pagesize) {
                    //    $scope.enableNextPage = false;
                    //}

                    //if (sessionStorage.getItem('selectedproj')) {
                    //    sessionStorage.removeItem('selectedproj');
                    //}
                }
            }
        };

        var ongetfilterlisterror = function (response) {

            console.log("ongetfilterlisterror : ", response);
        };



        //Function for Total buglist to Export
        $scope.model = function () {

            if ($scope.user_id != "" && $scope.bug_stat_id == "") {

                $scope.inputjson = {

                    bug_proj_id: sessionStorage.getItem('proj_id'),
                    bug_user_id: sessionStorage.getItem('loginuserid'),
                    user_id: sessionStorage.getItem('loginuserid'),
                    "user_id": $scope.user_id
                }

                console.log("inputjson : ", $scope.inputjson);
                bugFactory.reporterbyuser($scope.inputjson).then(ongetfilterlistssuccess, ongetfilterlisterror);

            }

            else if (sessionStorage.getItem('bug_stat_id') == null && sessionStorage.getItem('bug_sev_id') == null && sessionStorage.getItem('bug_assignedto') == null) {

                $scope.input = {

                    bug_proj_id: sessionStorage.getItem('proj_id'),
                    bug_user_id: sessionStorage.getItem('loginuserid'),
                    user_id: sessionStorage.getItem('loginuserid'),

                }

                bugFactory.get_total_buglistbyprojid($scope.input).then(ongetlistssuccess, ongetlisterror);

            }

            else {

                $scope.filtermodel = {

                    bug_proj_id: sessionStorage.getItem('proj_id'),
                    bug_filterstat_id: sessionStorage.getItem('bug_stat_id'),
                    bug_filtersev_id: sessionStorage.getItem('bug_sev_id'),
                    bug_filterassignedto: sessionStorage.getItem('bug_assignedto')

                };
                console.log("filtermodel : ", $scope.filtermodel);
                bugFactory.getbuglistbyfilter($scope.filtermodel).then(ongetfilterlistssuccess, ongetfilterlisterror);

            }

        }


        $scope.Find = function () {

            $scope.input = {

                "bug_proj_id": sessionStorage.getItem('proj_id'),
                "bug_filterstat_id": sessionStorage.getItem('bug_stat_id'),
                "bug_filtersev_id": sessionStorage.getItem('bug_sev_id'),
                "bug_filterassignedto": sessionStorage.getItem('bug_assignedto'),
                pagesize: $scope.pagesize,
                pageno: $scope.pageNo

            };

            console.log("input : ", $scope.input);

            if (sessionStorage.getItem('bug_stat_id') == "" && sessionStorage.getItem('bug_sev_id') == "" && sessionStorage.getItem('bug_assignedto') == "") {

                $scope.show = false;
                $scope.btn = false;
                $scope.show1 = true;
                $scope.btn1 = true;
                $scope.inputmodel = {

                    bug_proj_id: sessionStorage.getItem('proj_id'),
                    bug_user_id: sessionStorage.getItem('loginuserid'),
                    user_id: sessionStorage.getItem('loginuserid'),
                    pagesize: $scope.pagesize,
                    pageno: $scope.pageNo

                };

                console.log("input : ", $scope.inputmodel);
                bugFactory.getbuglistbyprojid($scope.inputmodel).then(ongetbuglistssuccess, ongetbuglisterror);

            }

            else {

                bugFactory.getbuglistbyfilter($scope.input).then(ongetbuglistssuccess, ongetbuglisterror);

            }

        };

        $scope.show = false;
        $scope.btn = false;
        $scope.show1 = true;
        $scope.btn1 = true;
        if (sessionStorage.getItem("isfilterenabled") != null) {

            if (sessionStorage.getItem("isfilterenabled") == "true") {

                $scope.isfiltersapplied = true;
                $scope.show = true;
                $scope.btn = true;
                $scope.show1 = false;
                $scope.btn1 = false;

            }
        }


        var onReportByuserssuccess = function (response) {
            console.log(" onReportByuserssuccess : ", response);

            if (response.data) {
                if (response.data.Message) {

                    $scope.buglistmodel = JSON.parse(response.data.Message);

                    for (var i = 0; i < $scope.buglistmodel.length; i++) {
                        $scope.buglistmodel[i].bug_stat_id = $scope.buglistmodel[i].bug_stat_id.toString();
                    }

                    console.log("$scope.buglistmodel  : ", $scope.buglistmodel);

                    $scope.getStyle = function (status) {
                        if (status == 1)
                            return { 'background-color': '#dc3912', 'color': 'white' };
                        else if (status == 2)
                            return { 'background-color': '#ff9900', 'color': 'white' };
                        else if (status == 3)
                            return { 'background-color': '#109618', 'color': 'white' };
                        else if (status == 4)
                            return { 'background-color': '#990099', 'color': 'white' };
                        else if (status == 5)
                            return { 'background-color': '#0099c6', 'color': 'white' };
                        else if (status == 6)
                            return { 'background-color': '#66aa00', 'color': 'white' };
                        else if (status == 7)
                            return { 'background-color': '#dd4477', 'color': 'white' };

                    };

                    $scope.totalPages = 1;
                    $scope.enableNextPage = true;
                    $scope.enablePrevPage = $scope.pageNo > 1;

                    if (JSON.parse(response.data.Message).length != $scope.pagesize) {
                        $scope.enableNextPage = false;
                    }
                    //if (sessionStorage.getItem('selectedproj')) {
                    //    sessionStorage.removeItem('selectedproj');
                    //}
                }
            }
        };



        //onReportbyuser error
        var onReportByusererror = function (response) {

            console.log("onReportByusererror : ", response);
        };




        //Assigneebyuser buglist
        if ($scope.user_id != "" && $scope.bug_stat_id != "") {

            $scope.show = true;
            $scope.btn = true;
            $scope.show1 = false;
            $scope.btn1 = false;

            $scope.Find();

        }

            //reporterbyuser bugslist
        else if ($scope.user_id != "") {

            $scope.show = false;
            $scope.btn = false;
            $scope.show1 = true;
            $scope.btn1 = true;

            $scope.inputjson = {

                "bug_proj_id": sessionStorage.getItem('proj_id'),
                "user_id": $scope.user_id,
                pagesize: $scope.pagesize,
                pageno: $scope.pageNo

            };

            console.log("inputjson : ", $scope.inputjson);
            bugFactory.reporterbyuser($scope.inputjson).then(onReportByuserssuccess, onReportByusererror);

        }

        else if ($scope.bug_stat_id != "") {

            $scope.show = true;
            $scope.btn = true;
            $scope.show1 = false;
            $scope.btn1 = false;

            $scope.Find();
        }

        else if ($scope.isfiltersapplied == false) {

            if (sessionStorage.getItem('selectedproj')) {
                $scope.show = false;
                $scope.btn = false;
                $scope.show1 = true;
                $scope.btn1 = true;
                $scope.inputmodel = {

                    bug_proj_id: sessionStorage.getItem('selectedproj'),
                    bug_user_id: sessionStorage.getItem('loginuserid'),
                    user_id: sessionStorage.getItem('loginuserid'),
                    pagesize: $scope.pagesize,
                    pageno: $scope.pageNo

                };

                bugFactory.getbuglistbyprojid($scope.inputmodel).then(ongetbuglistssuccess, ongetbuglisterror);
            }

            else {

                $scope.inputmodel = {

                    bug_proj_id: sessionStorage.getItem('proj_id'),
                    bug_user_id: sessionStorage.getItem('loginuserid'),
                    user_id: sessionStorage.getItem('loginuserid'),
                    pagesize: $scope.pagesize,
                    pageno: $scope.pageNo

                };

                console.log("input : ", $scope.inputmodel);

                bugFactory.getbuglistbyprojid($scope.inputmodel).then(ongetbuglistssuccess, ongetbuglisterror);

            }
        }

        else {
            $scope.Find();
        }


        $scope.bug = function () {
            $location.path('bug');

        };

        $scope.buglist = function () {
            sessionStorage.removeItem('selectedproj');
            $window.location.reload();
        };

        $scope.Filter = function () {
            $location.path('filter');

        };

        //clear Filter
        $scope.ClearFilter = function () {
            NProgress.start();
            $scope.show = false;
            $scope.btn = false;
            $scope.show1 = true;
            $scope.btn1 = true;

            $scope.isfiltersapplied = false;
            if (sessionStorage.getItem('selectedproj')) {

                $scope.inputmodel = {

                    bug_proj_id: sessionStorage.getItem('selectedproj'),
                    bug_user_id: sessionStorage.getItem('loginuserid'),
                    user_id: sessionStorage.getItem('loginuserid'),
                    pagesize: $scope.pagesize,
                    pageno: $scope.pageNo

                };

                bugFactory.getbuglistbyprojid($scope.inputmodel).then(ongetbuglistssuccess, ongetbuglisterror);

            }
            else if ($scope.user_id != "") {

                $scope.inputjson = {

                    "bug_proj_id": sessionStorage.getItem('proj_id'),
                    "user_id": $scope.user_id,
                    pagesize: $scope.pagesize,
                    pageno: $scope.pageNo

                };

                console.log("inputjson : ", $scope.inputjson);
                bugFactory.reporterbyuser($scope.inputjson).then(onReportByuserssuccess, onReportByusererror);

            }
            else {
                sessionStorage.removeItem('bug_sev_id');
                sessionStorage.removeItem('bug_stat_id');
                sessionStorage.removeItem('bug_assignedto');

                sessionStorage.removeItem('isfilterenabled');

                $scope.inputmodel = {

                    bug_proj_id: sessionStorage.getItem('proj_id'),
                    bug_user_id: sessionStorage.getItem('loginuserid'),
                    user_id: sessionStorage.getItem('loginuserid'),
                    pagesize: $scope.pagesize,
                    pageno: $scope.pageNo

                };

                console.log("input : ", $scope.inputmodel);

                bugFactory.getbuglistbyprojid($scope.inputmodel).then(ongetbuglistssuccess, ongetbuglisterror);

            }
        }
        $scope.statusmodel = {};


        $scope.loadstatus = function () {

            bugFactory.getstatus().then(ongetstatussuccess, ongetstatuserror);
        };

        //onget status success
        var ongetstatussuccess = function (response) {
            console.log(" onsuccess getstatus : ", response);
            if (response) {
                if (response.data.Message) {

                    $scope.statusmodel = JSON.parse(response.data.Message);
                    console.log("$scope.statusmodel  : ", $scope.statusmodel);
                }
            }
        };

        //onget staus error
        var ongetstatuserror = function (response) {
            console.log("error getstatus : ", response);
        };

        $scope.loadstatus();


        var onupdatesuccess = function (response) {

            console.log(JSON.stringify(response));
            if (response) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);

                    ngToast.success('Bug Updated Successfully');
                    //searchbugs();
                    //$location.path('bugList');
                }
            }
        };

        //onupdate error
        var onupdateerror = function (response) {

            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };

        //status changed
        $scope.onstatuschanged = function (bug) {
            $scope.inputjson = {
                bug_id: bug.bug_id,
                bug_stat_id: bug.bug_stat_id,
                bug_assignedby: profile[0].user_emailid,
                bug_pstat_id: bug.bug_pstat_id,
                user_id: loginuserid
            }

            bugFactory.update($scope.inputjson).then(onupdatesuccess, onupdateerror);
        }


        $scope.model();


        //Function for Export table data
        $(document).ready(function () {
            $("#btnExport").click(function (e) {
                e.preventDefault();

                //getting data from our table
                var data_type = 'data:application/vnd.ms-excel';
                var table_div = document.getElementById('table_wrapper');
                var table_html = table_div.outerHTML.replace(/ /g, '%20');

                var a = document.createElement('a');
                a.href = data_type + ', ' + table_html;
                a.download = 'Bugs Report' + '.xls';
                a.click();
            });
        });

    });

});