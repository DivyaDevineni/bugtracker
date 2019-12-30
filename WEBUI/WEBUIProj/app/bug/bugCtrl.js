var dependencies = ['main', 'bug/bugFactory', 'project/projectFactory', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app, bugFactory) {
    app.controller("bugCtrl", function ($scope, $window, $stateParams, $location, ngToast, bugFactory, $rootScope, projectFactory, masterdataFactory) {
        'use strict';




        var loginuserid = sessionStorage.getItem('loginuserid');
        console.log("login user id ", loginuserid);
        var profile = JSON.parse(sessionStorage.getItem('profile'));
        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        $(function () {

            $('#bug-time-line').click(function (e) {
                $("#time-line").delay(100).fadeIn(100);
                $("#bug-comm").fadeOut(100);
                $('#bug-comments').removeClass('active');
                $('#add-comment').css('display', 'none');
                $(this).addClass('active');
                e.preventDefault();
            });
            $('#bug-comments').click(function (e) {
                $("#bug-comm").delay(100).fadeIn(100);
                $("#time-line").fadeOut(100);
                $('#bug-time-line').removeClass('active');
                $('#add-comment').css('display','block');
                $(this).addClass('active');
                e.preventDefault();
            });
            $('#reply').click(function () {
                $(this).removeClass('active');
                $(this).addClass('reply active');
            });
        });

     

        $scope.saveJSON = function (com) {
            //$scope.toJSON = '';
            //$scope.toJSON = angular.toJson(com.attachmentpath);
            //var blob = new Blob([$scope.toJSON], { type: "application/json;charset=utf-8;" });
            //var downloadLink = angular.element('<a></a>');
            //downloadLink.attr('href', window.URL.createObjectURL(blob));
            //downloadLink.attr('download', com.attachmentpath);
            //downloadLink[0].click();

            $window.location.href = com.attachmentpath;
        };

        $scope.downloadFile = function (com) {
            window.open(com.attachmentpath, '_blank', '');
        }
        NProgress.start();

        //Sorting the table
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        //$(document).ready(function() {});

        $scope.bugmodel = {
            "bug_number": "3",
            "bug_assignedto": "",
            "bug_assignedby": profile[0].user_emailid,
            "bug_stat_id": "1",
            "bug_proj_id": sessionStorage.getItem('proj_id'),
            "user_id": loginuserid

        };



        $scope.bug_id = typeof ($stateParams.bug_id) == 'undefined' ? '' : $stateParams.bug_id;
        $scope.user_id = typeof ($stateParams.user_id) == 'undefined' ? '' : $stateParams.user_id;


        if ($scope.bug_id == "") { $scope.showhead = true } else { $scope.showhead = false };
        if ($scope.bug_id != "") { $scope.showheader = true } else { $scope.showheader = false };



        $scope.bug_stat_id = typeof ($stateParams.bug_stat_id) == 'undefined' ? '' : $stateParams.bug_stat_id;
        if (sessionStorage.getItem('selectedproj')) { $scope.list = true } else { $scope.list = false };







        $scope.modulemodel = {};
        $scope.filtermodel = {};

        // $scope.bugmodel = {};
        $scope.buglistmodel = { "com_createdby": profile[0].user_emailid };
        $scope.projmodel = {};
        $scope.commentmodel = {};
        $scope.commodel = {
            "com_id": ''
        };

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



        NProgress.start();
        $scope.show = true;
        $scope.isEdit = true;
        //$scope.btn = true;
        //$scope.btn1 = false;
        $scope.isdisable = false;


        $scope.editorEnabled = false;

        $scope.enableEditor = function (com) {

            $scope.commodel.com_description = com.com_description;

        };
        

        $scope.cancelcomment = function () {
            $scope.editorEnabled = false;
            $scope.getComments();
        }
        //comment update
        var oncommentupdatesuccess = function (response) {
            console.log(JSON.stringify(response));
            if (response) {
                if (response.data.Message) {

                    $scope.getComments();

                }
            }
        };
        var oncommentupdateerror = function (response) {
            console.log(JSON.stringify(response));

        };
        $scope.UpdateComment = function (com) {

            //$scope.commodel.com_description = $scope.com_description;
            $scope.commodel.com_id = com.com_id;
            bugFactory.updatecomment($scope.commodel).then(oncommentupdatesuccess, oncommentupdateerror);
        }


        var oncommentsuccess = function (response) {
            // console.log(JSON.stringify(response));
            $scope.commentmodel.com_description = "";
            if (response.data.Message) {
                var responsedata = JSON.parse(response.data.Message);
                $scope.getComments();
                if (response.data.Message.com_description != "") {
                    ngToast.success('Comment added Successfully');
                }
                else
                    ngToast.warning('please enter your comment');

                $scope.commentmodel.attachmentpath = "";
                $scope.commentmodel.com_attatch = "";
            }

        };
        var oncommenterror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };

        $scope.comment = function () {


            //console.log("buglistmodel", $scope.buglistmodel);
            $scope.commentmodel.com_bug_id = $scope.bugmodel.bug_id;
            $scope.commentmodel.com_proj_id = $scope.bugmodel.bug_proj_id;
            $scope.commentmodel.user_id = sessionStorage.getItem('loginuserid');
            $scope.commentmodel.com_stat_id = $scope.bugmodel.bug_stat_id;
            //$scope.buglistmodel.com_createdby = $scope.buglistmodel.bug_assignedto.toString();
            if ($scope.commentmodel.com_description != "") {
                bugFactory.comment($scope.commentmodel).then(oncommentsuccess, oncommenterror);
            }
            else
                ngToast.warning('please enter your comment');



        };


        //Edit bug
        $scope.editBug = function (bug) {
            NProgress.start();
            $scope.isEdit = false;
            $scope.btn1 = true;
            $scope.btn = false;
            $scope.show = false;
            $scope.isdisable = true;
            if (bug.bug_id != "") { $scope.showheader = true } else { $scope.showheader = false };
            if (bug.bug_id == "") { $scope.showhead = true } else { $scope.showhead = false };

            $scope.buglistmodel.bug_id = bug.bug_id;
            $scope.buglistmodel.bug_assignedby = profile[0].user_emailid;
            bugFactory.getbugdetailsbyid({ "bug_id": $scope.buglistmodel.bug_id }).then(ongetbugdetailssuccess, ongetbugdetailserror);
            //document.getElementById('userEdit').style.display = "block";
            $('#bugEdit').css('display', 'block');

        };

       
        $scope.historymodel = {};
        //ongetbugdetailssuccess
        var ongetbugdetailssuccess = function (response) {
            NProgress.done();

            console.log('response=' + JSON.stringify(response));

            if (response) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);
                    $scope.bugmodel = responsedata[0];

                    $scope.bugmodel.bug_assignedto = $scope.bugmodel.bug_assignedto.toString();
                    $scope.bugmodel.bug_assignedby = profile[0].user_emailid;
                    $scope.bugmodel.bug_stat_id = $scope.bug_stat_id = $scope.bugmodel.bug_stat_id.toString();


                    $scope.bugmodel.bug_sev_id = $scope.bugmodel.bug_sev_id.toString();
                    $scope.bugmodel.bug_mod_id = $scope.bugmodel.bug_mod_id.toString();

                    //for (var i = 0; i < responsedata.length; i++) {
                    $scope.historymodel = responsedata[0];
                    $scope.commentmodel = responsedata[0];
                        // bugFactory.getbugmodule({ "mod_proj_id": sessionStorage.getItem('proj_id') }).then(ongetbugmodulesuccess, ongetbugmoduleerror);
                    
                }
            }
        };


        //ongetbugdetailserror
        var ongetbugdetailserror = function (response) {
            console.log(JSON.parse(response.data.Message));
        };

       
       
       

        //onupdate success
        var onupdatesuccess = function (response) {

            console.log(JSON.stringify(response));
            if (response) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);
                    ngToast.success('Bug Updated Successfully');

                    //$location.path('bug');

                    
                }
            }
            $('#bugEdit').css('display', 'none');
            //document.getElementById('bugEdit').style.display = "none";
            //$scope.Find();
            $rootScope.$emit("RefreshProjects", {});
            $location.path('bug');
        };

        //onupdate error
        var onupdateerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };

        //update bug
        $scope.Update = function () {

            //document.getElementById("overlay").style.display = "block";
            NProgress.start();
            console.log("buglistmodel", $scope.buglistmodel);

            $scope.bugmodel.bug_pstat_id = $scope.bug_stat_id;
            $scope.bugmodel.user_id = profile[0].user_id;

            bugFactory.update($scope.bugmodel).then(onupdatesuccess, onupdateerror);



        };



        $scope.isfiltersapplied = false;


        //on getbuglist success
        var ongetbuglistssuccess = function (response) {
            console.log(" onsuccess getbuglist : ", response);

            if (response.data) {

                if (response.data.Message) {

                    $scope.buglistmodel = JSON.parse(response.data.Message);
                    var a = [];
                    for (var i = 0; i < $scope.buglistmodel.length; i++) {
                        a[i] = $scope.buglistmodel[i].key;
                    }

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
                    }

                    if (sessionStorage.removeItem('selectedproj'))
                        sessionStorage.removeItem('selectedproj');

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
            NProgress.start();

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
                $scope.isEdit = false;
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
        $scope.isEdit = false;
        $scope.btn = false;
        $scope.show1 = true;
        $scope.btn1 = true;
        if (sessionStorage.getItem("isfilterenabled") != null) {

            if (sessionStorage.getItem("isfilterenabled") == "true") {

                $scope.isfiltersapplied = true;
                $scope.show = true;
                $scope.isEdit = true;
                //$scope.btn = true;
                $scope.show1 = false;
                //$scope.btn1 = false;

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
            $scope.isEdit = true;
            $scope.btn = true;
            $scope.show1 = false;
            $scope.btn1 = false;

            $scope.Find();

        }

            //reporterbyuser bugslist
        else if ($scope.user_id != "") {

            $scope.show = false;
            $scope.isEdit = false;
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
            $scope.isEdit = true;
            $scope.btn = true;
            $scope.show1 = false;
            $scope.btn1 = false;

            $scope.Find();
        }

        else if ($scope.isfiltersapplied == false) {

            if (sessionStorage.getItem('selectedproj')) {
                $scope.show = false;
                $scope.isEdit = false;
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
            $('#filterEdit').css('display', 'block');

        };
       

        //clear Filter
        $scope.ClearFilter = function () {


            NProgress.start();
            $scope.show = false;
            $scope.isEdit = false;
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
                $scope.loadstatus();
                $scope.loadseverity();
                $scope.loadassignee();

               

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

        //status changed
        $scope.onstatuschanged = function (bug) {
            if (bug.bug_stat_id != bug.bug_pstat_id) {
                
            $scope.inputjson = {
                bug_id: bug.bug_id,
                bug_stat_id: bug.bug_stat_id,
                bug_assignedby: profile[0].user_emailid,
                bug_pstat_id: bug.bug_pstat_id,
                user_id: loginuserid
            }

            bugFactory.update($scope.inputjson).then(onupdatesuccess, onupdateerror);
            }
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



        //bug ctrl code


        //get projects by userid
        $scope.load = function () {
            bugFactory.getprojectsbyuserid({ puser_user_id: sessionStorage.getItem('loginuserid') }).then(ongetprojectsuccess, ongetprojecterror);
        };
        //on project success
        var ongetprojectsuccess = function (response) {
            console.log(" onsuccess getprojectbyuserid : ", response);
            if (response) {
                if (response.data.Message) {
                    $scope.projlistmodel = JSON.parse(response.data.Message);
                    console.log("$scope.projmodel  : ", $scope.projmodel);
                }
            }


        };

        //on project error
        var ongetprojecterror = function (response) {
            console.log("error getprojectbyuserid : ", response);
        };




        //load severity
        $scope.loadseverity = function () {

            bugFactory.getseverity().then(ongetsevesuccess, ongetseveerror);
        };

        //on get severity success
        var ongetsevesuccess = function (response) {
            console.log(" onsuccess  getseverity  : ", response);
            if (response) {
                if (response.data.Message) {

                    $scope.severitymodel = JSON.parse(response.data.Message);
                    console.log("$scope.severitymodel  : ", $scope.severitymodel);

                }
            }

        };

        //onget severity error
        var ongetseveerror = function (response) {
            console.log("error getseverity : ", response);
        };


        $scope.showheader = true;
        $scope.showhead = false;


        $scope.addBug = function () {
            //document.getElementById('#bugEdit').style.display = "block"
            $scope.isEdit = true;
            $scope.btn = true;
            $scope.btn1 = false;
            $scope.showheader = false;
            $scope.showhead = true;
            $scope.bugmodel = { "bug_proj_id": sessionStorage.getItem('proj_id'), "bug_assignedby": profile[0].user_emailid, };
            $('#bugEdit').css('display', 'block');
        };
        $scope.showheader = true;
        $scope.showhead = false;

        $scope.Add = function (form) {
            if (form.$valid) {

                NProgress.start();
                console.log("bugmodel", $scope.bugmodel);
                $scope.bugmodel.bug_assignedby = profile[0].user_emailid;

                $scope.bugmodel.bug_createdby = loginuserid;
                if ($scope.bugmodel.bug_assignedto == "") {
                    $scope.bugmodel.bug_assignedto = loginuserid;
                }

                bugFactory.insert($scope.bugmodel).then(oninsertsuccess, oninserterror);

            }

        };
        $scope.cancel = function (id, visibility) {
            document.getElementById(id).style.display = visibility;
        };


        var oninsertsuccess = function (response) {
            //NProgress.done();
            console.log(JSON.stringify(response));
            if (response) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);
                    ngToast.success('Bug Added Successfully');
                    $rootScope.$emit("RefreshProjects", {});
                    $location.path('bug');

                }
            }
            document.getElementById(id).style.display = visibility;



        };

        var oninserterror = function (response) {

            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };


        $scope.Cancel = function () {
            $location.path('bug');


        };

        //on module success
        var ongetmodulesuccess = function (response) {
            console.log(" onsuccess getmodules : ", response);
            if (response) {
                if (response.data.Message) {


                    $scope.modulemodel = JSON.parse(response.data.Message);
                    console.log("$scope.modulemodel  : ", $scope.modulemodel);
                }
            }

        };

        //on module error
        var ongetmoduleerror = function (response) {
            console.log("error getmodules : ", response);
        };


       

        var getassignedusers = function () {
            bugFactory.getassignedusers({ "user_proj_id": sessionStorage.getItem('proj_id') }).then(ongetassigneduserssuccess, ongetassigneduserserror);
        }

        getassignedusers();

        //on project changed

        var onprojectchanged = function () {
            console.log($scope.bugmodel.bug_assignedto);
            console.log($scope.bugmodel.bug_mod_id);
            bugFactory.getassignedusers({ "user_proj_id": sessionStorage.getItem('proj_id') }).then(ongetassigneduserssuccess, ongetassigneduserserror);
            bugFactory.getmodule({ "mod_proj_id": sessionStorage.getItem('proj_id') }).then(ongetmodulesuccess, ongetmoduleerror);
        }

        //onget assigned users success
        var ongetassigneduserssuccess = function (response) {
            console.log(" onsuccess getassignedusers : ", response);
            if (response) {

                if (response.data.Message) {


                    $scope.assignedUsers = JSON.parse(response.data.Message);
                    console.log("$scope.projmodel  : ", $scope.projmodel);
                }
            }
        };

        var ongetassigneduserserror = function (response) {

            console.log("error getassignedusers : ", response);
        };

        //load functions

        $scope.loadseverity();
        // $scope.loadstatus();

        $scope.load();


        // adding fileupload code

        // GET THE FILE INFORMATION.
        $scope.getFileDetails = function (e) {

            $scope.files = [];
            $scope.$apply(function () {

                // STORE THE FILE OBJECT IN AN ARRAY.
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
                }

            });
            $scope.uploadFiles();
        };

        // NOW UPLOAD THE FILES.
        $scope.uploadFiles = function () {

            //FILL FormData WITH FILE DETAILS.
            var data = new FormData();

            for (var i in $scope.files) {
                data.append("uploadedFile", $scope.files[i]);
            };

            bugFactory.UploadFoodImages(data, function (resdata) {

                //document.getElementById('FileName').value = resdata;
                //seting return file name to scope logo and imagepath to bind
                // replacing double quotes with empty string
                resdata = resdata.replace(/['"]+/g, '');
                // spliting for logo i.e filename and image path
                $scope.bugmodel.bug_attachment = resdata;
                var values = resdata.split(",");
                $scope.bugmodel.bug_attachment = values[0];
                $scope.bugmodel.attachmentpath = values[1];

                // refreshing the image path to image tag once new image path is loaded.
                $scope.$apply(function () {
                    $scope.bugmodel.attachmentpath = values[1];;
                });
            });

        };



        $scope.getFileDetails1 = function (e) {

            $scope.files = [];
            $scope.$apply(function () {

                // STORE THE FILE OBJECT IN AN ARRAY.
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
                }

            });

            $scope.uploadCommentFiles();
        };
        
        $scope.uploadCommentFiles = function () {

            //FILL FormData WITH FILE DETAILS.
            var data = new FormData();

            for (var i in $scope.files) {
                data.append("uploadedFile", $scope.files[i]);
            };

            bugFactory.UploadFoodImages1(data, function (resdata) {

                //document.getElementById('FileName').value = resdata;
                //seting return file name to scope logo and imagepath to bind
                // replacing double quotes with empty string
                resdata = resdata.replace(/['"]+/g, '');
                // spliting for logo i.e filename and image path
                $scope.commentmodel.com_attatch = resdata;
                var values = resdata.split(",");
                $scope.commentmodel.com_attatch = values[0];
                $scope.commentmodel.attachmentpath = values[1];

                // refreshing the image path to image tag once new image path is loaded.
                $scope.$apply(function () {
                    $scope.commentmodel.attachmentpath = values[1];;
                });


            });

        };



        onprojectchanged();




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

            bugFactory.getassignedusers({ "user_proj_id": sessionStorage.getItem('proj_id') }).then(ongetfilterassigneduserssuccess, ongetfilterassigneduserserror);
        };

        var ongetfilterassigneduserssuccess = function (response) {
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

        var ongetfilterassigneduserserror = function (response) {

            console.log("error getassignedusers : ", response);
        };





      


        $scope.Filters = function () {
            $('#filterEdit').css('display', 'none');
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

            //$location.path('bugList');
            $scope.Find();

        };






        $scope.Cancel = function () {
            $scope.show = false;
            $scope.btn = false;
            $scope.show1 = true;
            $scope.btn1 = true;
            if (sessionStorage.getItem('bug_stat_id') || sessionStorage.getItem('bug_sev_id') || sessionStorage.getItem('bug_assignedto')) {





                sessionStorage.setItem("isfilterenabled", true);
            }
            else {
                sessionStorage.setItem("isfilterenabled", false);
            }
            //$location.path('bugList');

        };





        // History module
        var ongethistorysuccess = function (response) {
            console.log(" onsuccess getHistory : ", response);
            if (response.data.Message) {

                $scope.History = JSON.parse(response.data.Message);
                console.log("history is", response.data.Message);
                for (var i = 0, len = $scope.History.length; i < len; i++) {
                    var history = $scope.History[i];
                    if (history.hist_action == "Bug Filed") {
                        $scope.History[i].paneltype = "panel-success";
                        $scope.History[i].icontype = "glyphicon-plus";
                        $scope.History[i].show = true;
                        //angular.element('#panel').addClass('panel-success'); 
                        //angular.element('#icon').addClass('glyphicon-plus');
                    }
                    if (history.hist_action != "Bug Filed") {
                        $scope.History[i].paneltype = "panel-primary";
                        $scope.History[i].icontype = "glyphicon-edit";
                        $scope.History[i].show = false;
                        //angular.element('#panel').addClass('panel-primary');
                        //angular.element('#icon').addClass('glyphicon-edit');
                    }

                    var date = moment.utc(history.hist_createddate, "YYYY-MM-DD HH:mm");
                    $scope.History[i].hist_createddate = moment(date._d).format('YYYY-MM-DD HH:mm');

                    $scope.errorMsg = " ";
                }

                $scope.getStyle1 = function (status) {
                    if (status == 1)
                        return { 'color': '#dc3912' };
                    else if (status == 2)
                        return { 'color': '#ff9900' };
                    else if (status == 3)
                        return { 'color': '#109618' };
                    else if (status == 4)
                        return { 'color': '#990099' };
                    else if (status == 5)
                        return { 'color': '#0099c6' };
                    else if (status == 6)
                        return { 'color': '#66aa00' };
                    else if (status == 7)
                        return { 'color': '#dd4477' };


                };
            } else {
                $scope.error = !response.data.Message ? true : false;
                $scope.errorMsg = "No History";
            }
        };

        var ongethistoryerror = function (response) {
            console.log("error getComments : ", response);
        };



        $scope.getHistory = function () {
            bugFactory.getHistory({ "com_bug_id": $scope.historymodel.bug_id }).then(ongethistorysuccess, ongethistoryerror);
        }
        $scope.getHistory();



        // comment module
        var ongetcommentsuccess = function (response) {
            console.log(" onsuccess getcomments : ", response);
            if (response.data.Message) {

                $scope.Comments = JSON.parse(response.data.Message);
                for (var i = 0, len = $scope.Comments.length; i < len; i++) {
                    var selectedComm = $scope.Comments[i];
                    var createddate = moment.utc(selectedComm.com_createddate, "YYYY-MM-DD HH:mm");
                    $scope.Comments[i].com_createddate = moment(createddate._d).format('YYYY-MM-DD HH:mm');
                    $scope.errorMsg = " ";
                }
                $scope.editorEnabled = false;
            } else {
                $scope.error = !response.data.Message ? true : false;
                $scope.errorMsg = "No Comments";
            }
        };

        var ongetcommenterror = function (response) {
            console.log("error getComments : ", response);
        };



        $scope.getComments = function () {
            bugFactory.getComments({ "com_bug_id": $scope.commentmodel.bug_id }).then(ongetcommentsuccess, ongetcommenterror);
        }
        $scope.getComments();






        $scope.loadstatus();
        $scope.loadseverity();
        $scope.loadassignee();




    });

});
