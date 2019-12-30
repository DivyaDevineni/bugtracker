var dependencies = ['main', 'module/moduleFactory'];
define(dependencies, function (app, moduleFactory) {
    app.controller("moduleListCtrl", function ($scope, $location, ngToast, moduleFactory) {
        'use strict';
        

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }
        NProgress.start();
        $scope.$parent.title = "Module";
        $scope.model = moduleFactory.model();
        // defining page size manually
        $scope.pagesize = 8;

        var Search = function () {
            $scope.model.pagesize = $scope.pagesize;
            $scope.model.pageno = $scope.pageNo;
            moduleFactory.search($scope.model).then(onSearchSuccess, onSearchError);
        };

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
            Search();
        };

        //Go for Previous page in ui-grid
        $scope.prevPage = function () {
            $scope.pageNo--;
            $scope.enableNextPage = $scope.totalPages - $scope.pageNo > 0;
            $scope.enablePrevPage = $scope.pageNo > 1;
            Search();
        };

        //Deactivate
        var onDeactivateSuccess = function (response) {
            ngToast.success("Module deactivated successfully");
            //$location.path('scheduletripList');
            Search();
        };

        var onDeactivateError = function (response) {
        };

        var ongetprojsuccess = function (response) {
            console.log(" onsuccess getprojectbyuser : ", response);
            $scope.projlist = JSON.parse(response.data.Message);
            console.log("$scope.projmodel  : ", $scope.projmodel);
        };

        var ongetprojerror = function (response) {
            console.log("error getprojectbyuser : ", response);
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
                $scope.totalPages = 1;
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

        var onGetSuccess = function (response) {
            console.log(JSON.stringify(response));
            $('#moduleEdit').css('display','block');

            var responsedata = JSON.parse(response.data.Message);
            $scope.model = responsedata[0];
            $scope.model.mod_proj_id = responsedata[0].mod_proj_id.toString();
            $scope.model.mod_isactive = responsedata[0].mod_isactive.toString();
        };

        var onGetError = function (response) {
            console.log(JSON.stringify(response));
        };

        $scope.addModule = function () {
            //$('#moduleEdit').css('display', 'none');
            $scope.model = moduleFactory.model();
        }

        $scope.Save = function (form) {
                
                NProgress.start();
                
                moduleFactory.insert($scope.model).then(onInsertSuccess, onInsertError);
        };

        $scope.Edit = function (mod) {
            //$location.path('module/' + mod.mod_id);
            $('#moduleEdit').css('display', 'none');
            moduleFactory.get({ mod_id: mod.mod_id }).then(onGetSuccess, onGetError);
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
                moduleFactory.deactivate({ mod_id: mod.mod_id, mod_isactive: state, user_id: sessionStorage.getItem('loginuserid') }).then(onDeactivateSuccess, onDeactivateError);
            }
        };

        Search();

        moduleFactory.getprojectsbyuserid({ puser_user_id: sessionStorage.getItem('loginuserid') }).then(ongetprojsuccess, ongetprojerror);


    });

});