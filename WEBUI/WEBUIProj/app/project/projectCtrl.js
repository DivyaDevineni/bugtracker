var dependencies = ['main', 'project/projectFactory', 'common/masterdataFactory', 'moment-picker'];
define(dependencies, function (app, projectFactory) {
    app.controller("projectCtrl", function ($rootScope, $scope, $stateParams, $location, projectFactory, masterdataFactory, ngToast) {
        'use strict';
        NProgress.start();

        var loginuserid = sessionStorage.getItem('loginuserid');
        var profile = JSON.parse(sessionStorage.getItem('profile'));
        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        //var logintype = sessionStorage.getItem('usertype');
        $scope.proj_id = typeof ($stateParams.proj_id) == 'undefined' ? '' : $stateParams.proj_id;
        if ($scope.proj_id != "") { $scope.show = true } else { $scope.show = false };
        if ($scope.proj_id == "") { $scope.showBtn = true } else { $scope.showBtn = false };
        
        
        console.log("loginuserid : ", loginuserid);

        $scope.iprojmodel = {};
        $scope.projlistmodel = {};
        $scope.projmodel = {
            "user_emailid": profile[0].user_emailid
        };
        $scope.create = function () {
            $scope.showBtn = true;
            $scope.show = false;
            $scope.isEdit = false;
            $scope.projmodel = {
                "user_emailid": profile[0].user_emailid
            };
            //document.getElementById('projectEdit').style.display = "block";
        };

        $scope.buglist = function (proj) {

            sessionStorage.setItem('selectedproj', proj.proj_id);
            $location.path('bug');



        };

        var onInsertsuccess = function (response) {
            console.log(JSON.stringify(response));
            if (response.data.Message) {
                if (response.data.Message == '23505: duplicate key value violates unique constraint "project_proj_name_key"') {
                    ngToast.warning('Projectr already exists');

                }
                else {
                    ngToast.success('Project Created Successfully');

                }
                $rootScope.$emit("RefreshProjects", {});
                //NProgress.done();
                //$location.path('project');
            }
            document.getElementById('projectEdit').style.display = "none";
        };

        var onInserterror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };



        $scope.add = function (form) {
            if (form.$valid) {
                //NProgress.start();
                //document.getElementById('projectEdit').style.display = "block";
            $scope.projmodel.proj_status = 'active';
            console.log("projmodel", $scope.projmodel);
            $scope.projmodel.proj_createdby = loginuserid;
            $scope.projmodel.user_id = loginuserid;
            projectFactory.insert($scope.projmodel).then(onInsertsuccess, onInserterror);
            }
        };
        $scope.Cancel = function () {
            //document.getElementById('projectEdit').style.display = "none";
            //$rootScope.$emit("RefreshProjects", {});
            //console.log('projectList');
            //$location.path('projectList');
        };
        var onUpdatesuccess = function (response) {
            //NProgress.done();
            console.log(JSON.stringify(response));
            ngToast.success('Project updated Successfully');

            //$location.path('projectList');
            //document.getElementById('projectEdit').style.display = "none";
            $rootScope.$emit("RefreshProjects", {});

        };

        var onUpdateerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };
        $scope.update = function () {
            
                //NProgress.start();
                $scope.showBtn = false;
                console.log("projmodel", $scope.projmodel);
                projectFactory.Update($scope.projmodel).then(onUpdatesuccess, onUpdateerror);
            
        };


        var onGetProjsuccess = function (response) {
            NProgress.done();
            $('#projectEdit').css('display', 'block');
            //console.log(JSON.parse(response.data.Message));
            if (response.data.Message) {
                var responsedata = JSON.parse(response.data.Message);
                $scope.projmodel = responsedata[0];
                console.log("$scope.projmodel", $scope.projmodel);
            }
            NProgress.done();

        };

        var onGetProjerror = function (response) {
            console.log(JSON.stringify(response));
        };

        $scope.edit = function (proj) {
            NProgress.start();
            $('#projectEdit').css('display', 'none');
            if (proj.proj_id != "") {
                $scope.show = true;
                $scope.isEdit = true;
                //$scope.showheader = true;
                $scope.showBtn = false;
                //$scope.showhead = false;

            }
            $scope.projlistmodel.proj_id = proj.proj_id;
            projectFactory.getProjbyId({ "proj_id": $scope.projlistmodel.proj_id }).then(onGetProjsuccess, onGetProjerror);

            //document.getElementById('projectEdit').style.display = "block";

        };

        $scope.isowner = false;
        /* if(sessionStorage.getItem('usertype')=="Manager"){
             $scope.isowner = true;
         }*/

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
            $scope.load();
        };

        //Go for Previous page in ui-grid
        $scope.prevPage = function () {
            $scope.pageNo--;
            $scope.enableNextPage = $scope.totalPages - $scope.pageNo > 0;
            $scope.enablePrevPage = $scope.pageNo > 1;
            $scope.load();
        };

        var onSearchsuccess = function (response) {
            console.log(" onsuccess getprojectbyuser : ", response);
            if (response.data.Message) {
                $scope.projlistmodel = JSON.parse(response.data.Message);
                console.log("$scope.projlistmodel  : ", $scope.projlistmodel);
                for (var i = 0, len = $scope.projlistmodel.length; i < len; i++) {
                    if ($scope.projlistmodel[i].puser_role == "owner") {
                        $scope.projlistmodel[i].isowner = true;
                        $scope.isowner = true;
                    }
                }
                $scope.totalPages = 1;
                $scope.enableNextPage = true;
                $scope.enablePrevPage = $scope.pageNo > 1;

                if (JSON.parse(response.data.Message).length != $scope.pagesize) {
                    $scope.enableNextPage = false;
                }
                NProgress.done();
            }
        };

        //$(function () {
        //    $('a[href*="#"]:not([href="#"])').click(function () {
        //        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        //            var target = $(this.hash);
        //            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        //            if (target.length) {
        //                $('html, body').animate({
        //                    scrollTop: target.offset().top
        //                }, 1000);
        //                return false;
        //            }
        //        }
        //    });
        //});
        //$('.carousel').carousel({
        //    interval: 5000 //changes the speed
        //})
        var onSearcherror = function (response) {
            console.log("error getprojectbyuser : ", response);
        };

        $scope.load = function () {

            $scope.projlistmodel.proj_status = 'active';

            $scope.iprojmodel.puser_user_id = loginuserid;
            $scope.iprojmodel.pagesize = $scope.pagesize;
            $scope.iprojmodel.pageno = $scope.pageNo;

            projectFactory.getprojectsbyuserid($scope.iprojmodel).then(onSearchsuccess, onSearcherror);
        };


        var ondeleteProjsuccess = function (response) {
            NProgress.done();
            console.log(" ondeletesuccess  : ", response);
            $rootScope.$emit("RefreshProjects", {});
            ngToast.success('Project deleted Successfully');
            //$scope.load();


        };

        var ondeleteProjerror = function (response) {
            console.log("error on delete: ", response);
        };

        $scope.delete = function (proj) {
            NProgress.start();
            console.log('project : ', proj);
            //$location.path('projectList/' + proj.proj_id);
            //var r = confirm("Are you sure you want to deactivate the record ?");

            projectFactory.deleteproject({ "proj_id": proj.proj_id }).then(ondeleteProjsuccess, ondeleteProjerror);


        };

        /* $scope.loadtrashed = function () {
 
             $scope.iprojmodel.puser_user_id = loginuserid;
 
             projectFactory.gettrashedprojectsbyuserid($scope.iprojmodel).then(onloadtrashedsuccess, onloadtrashederror);
         };
 
 
         var onloadtrashedsuccess = function (response) {
             console.log(" onsuccess gettrashedprojectbyuser : ", response);
 
             $scope.projlistmodel = JSON.parse(response.data.Message);
             console.log("$scope.projlistmodel  : ", $scope.projlistmodel);
 
 
         };
         var onloadtrashederror = function (response) {
             console.log("error gettrashedprojectbyuser : ", response);
         };*/

        $scope.load();
        //$scope.loadtrashed();

        /*var onprojectchanged = function () {
            console.log($scope.projlistmodel);
        };*/


    });







});