var dependencies = ['main', 'common/masterdataFactory', 'module/moduleFactory', 'moment-picker'];
define(dependencies, function (app) {
    app.controller("moduleCtrl", function ($scope, $stateParams, $location, masterdataFactory, moduleFactory, ngToast) {
        'use strict';

        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        $scope.addModule = function () {
            $scope.isEdit = false;
            $scope.model = moduleFactory.model();
        };
        
        //$scope.mod_id = typeof ($stateParams.mod_id) == 'undefined' ? '' : $stateParams.mod_id;
        //$scope.IsEdit = typeof ($stateParams.mod_id) != 'undefined';
        $scope.model = moduleFactory.model();

        $scope.$parent.title = "Module";

        //if ($scope.IsEdit) {
        //    $scope.Title = "Edit Module";
        //}

        var ongetprojsuccess = function (response) {
            console.log(" onsuccess getprojectbyuser : ", response);
            $scope.projlist = JSON.parse(response.data.Message);
            console.log("$scope.projmodel  : ", $scope.projmodel);
        };

        var ongetprojerror = function (response) {
            console.log("error getprojectbyuser : ", response);
        };

        //#region Methods
        var onSearchSuccess = function (response) {

            if (response.data.Message) {
                //$scope.gridOptions.data = JSON.parse(response.data.Message);
                $scope.moduleList = JSON.parse(response.data.Message);
                for (var i = 0, len = $scope.moduleList.length; i < len; i++) {
                    if ($scope.moduleList[i].mod_isactive == true) {
                        $scope.moduleList[i].status = "Active";
                        //angular.element('#status').addClass('label label-success');
                    } else {
                        $scope.moduleList[i].status = "Inactive";
                        //angular.element('#status').addClass('label label-danger');
                    }
                }
                
                $scope.totalrecords = $scope.moduleList[0].totalrecords.count;
                $scope.totalPages = $scope.totalrecords % 10 == 0 ? $scope.totalrecords / 10 : ($scope.totalrecords / 10) + 1;
                $scope.enableNextPage = true;
                $scope.enablePrevPage = $scope.pageNo > 1;

                if (JSON.parse(response.data.Message).length != $scope.pagesize) {
                    $scope.enableNextPage = false;
                }
                console.log("moduleList : ", $scope.moduleList);
                NProgress.done();

            }
            else
                $scope.moduleList = [];
            NProgress.done();
        };

        var onSearchError = function (response) {
            console.log(JSON.stringify(response));
        };

        var onInsertSuccess = function (response) {
            NProgress.done();
            console.log(JSON.stringify(response));
            ngToast.success('Module saved successfuly');
            // ngToast.success('Driver created successfuly');
            //$location.path('moduleList');
            Search();
            
        };

        var onInsertError = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning(response.data);
        };

        var onUpdateSuccess = function (response) {
            NProgress.done();
            console.log(JSON.stringify(response));
            ngToast.success('Module saved successfuly');
            //$location.path('moduleList');
            //$scope.mod_id = '';
            sessionStorage.removeItem('mod_id');
            Search();
            
        };

        var onUpdateError = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning(response.data);
        };

        var onGetSuccess = function (response) {
            NProgress.done();
            console.log(JSON.stringify(response));
            $('#moduleEdit').css('display', 'block');
            var responsedata = JSON.parse(response.data.Message);
            $scope.model = responsedata[0];
            $scope.model.mod_proj_id = responsedata[0].mod_proj_id.toString();
            $scope.model.mod_isactive = responsedata[0].mod_isactive.toString();
        };

        var onGetError = function (response) {
            console.log(JSON.stringify(response));
        };

        //Deactivate
        var onDeactivateSuccess = function (response) {
            ngToast.success("Module deactivated successfully");
            //$location.path('scheduletripList');
            Search();
        };

        var onDeactivateError = function (response) {
        };

        if (sessionStorage.getItem('mod_id')) {
            $('#moduleEdit').css('display', 'block');
            $scope.isEdit = true;
            moduleFactory.get({ mod_id: sessionStorage.getItem('mod_id') }).then(onGetSuccess, onGetError);
        }
        var getproj = function () {
            moduleFactory.getprojectsbyuserid({ puser_user_id: sessionStorage.getItem('loginuserid') }).then(ongetprojsuccess, ongetprojerror);
        };

        var Search = function () {
            $scope.model.pagesize = $scope.pagesize;
            $scope.model.pageno = $scope.pageNo;
            moduleFactory.search($scope.model).then(onSearchSuccess, onSearchError);
        };

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
            Search();
        };

        //Go for Previous page in ui-grid
        $scope.prevPage = function () {
            $scope.pageNo--;
            $scope.enableNextPage = $scope.totalPages - $scope.pageNo > 0;
            $scope.enablePrevPage = $scope.pageNo > 1;
            Search();
        };

        $scope.Save = function (form) {
            if (form.$valid) {
                NProgress.start();
                $('#moduleEdit').css('display', 'none');
                //Update
                if (sessionStorage.getItem('mod_id')) {
                    moduleFactory.update($scope.model).then(onUpdateSuccess, onUpdateError);
                }
                //Add
                else {
                    moduleFactory.insert($scope.model).then(onInsertSuccess, onInsertError);
                }
            }
        };

        $scope.Edit = function (mod) {
            NProgress.start();
            $('#moduleEdit').css('display', 'none');
            $scope.isEdit = true;
            sessionStorage.setItem("mod_id", mod.mod_id);
            moduleFactory.get({ mod_id: mod.mod_id }).then(onGetSuccess, onGetError);
        };

        $scope.Cancel = function () {
            //$location.path('moduleList');
            if(sessionStorage.getItem('mod_id')){
                sessionStorage.removeItem('mod_id');
            }
            $('#moduleEdit').css('display', 'none');
        };

        //Activate or inactivate the record
        $scope.deactivate = function (mod, state) {
            var txt;
            if (state == false) {
                var r = confirm("Are you sure you want to deactivate the record ?");
            } else {
                var r = confirm("Are you sure you want to activate the record ?");
            }
            if (r) {
                $('#moduleEdit').css('display', 'none');
                moduleFactory.deactivate({ mod_id: mod.mod_id, mod_isactive: state, user_id: sessionStorage.getItem('loginuserid') }).then(onDeactivateSuccess, onDeactivateError);
            }
        };

        getproj();
        Search();


    });
});