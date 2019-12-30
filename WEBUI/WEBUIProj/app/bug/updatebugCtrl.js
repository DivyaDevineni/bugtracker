var dependencies = ['main', 'bug/bugFactory', 'project/projectFactory', 'common/masterdataFactory'];
define(dependencies, function (app, bugFactory) {
    app.controller("updatebugCtrl", function ($scope, $stateParams, $location, bugFactory, projectFactory, masterdataFactory, ngToast) {
        'use strict';

        $scope.bug_id = typeof ($stateParams.bug_id) == 'undefined' ? '' : $stateParams.bug_id;
      
        var profile = JSON.parse(sessionStorage.getItem('profile'));
        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        $scope.statusmodel = {};
        $scope.buglistmodel = { "com_createdby": profile[0].user_emailid };

        $scope.severitymodel = {};
        $scope.projmodel = {};
        $scope.modulemodel = {};
        $scope.emailmodel = {
            //"bug_assignedby": profile[0].user_emailid
        };
        $scope.commentmodel = {};
        $scope.commodel = {
        "com_id":''};

        NProgress.start();

        $scope.Cancel = function () {
            $location.path('bugList');
        };
        
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
        $scope.UpdateComment=function(com)
        {
            
            //$scope.commodel.com_description = $scope.com_description;
            $scope.commodel.com_id = com.com_id;
            bugFactory.updatecomment($scope.commodel).then(oncommentupdatesuccess, oncommentupdateerror);
        }


        //onupdate success
        var onupdatesuccess = function (response) {
            NProgress.done();
            console.log(JSON.stringify(response));
            if (response) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);
                    ngToast.success('Bug Updated Successfully');
                    
                    $location.path('bugList');
                   
                }
            }
        };

        //onupdate error
        var onupdateerror = function (response) {
            console.log(JSON.stringify(response));
            ngToast.warning('Error');
        };
        
        //update bug
        $scope.Update = function (form) {
            if (form.$valid) {
                //document.getElementById("overlay").style.display = "block";
                NProgress.start();
                console.log("buglistmodel", $scope.buglistmodel);
                $scope.buglistmodel.bug_assignedby = profile[0].user_emailid;
                $scope.buglistmodel.bug_pstat_id = $scope.bug_stat_id;
                $scope.buglistmodel.user_id = profile[0].user_id;

                bugFactory.update($scope.buglistmodel).then(onupdatesuccess, onupdateerror);
                
            }

        };


        //ongetstatussuccess 
        var ongetstatussuccess = function (response) {
            console.log(" onsuccess getstatus  : ", response);
            if (response) {
                if (response.data.Message) {

                    $scope.statusmodel = JSON.parse(response.data.Message);
                    console.log("$scope.statusmodel  : ", $scope.statusmodel);


                }
            }
        };
        //ongetstatuserror
        var ongetstatuserror = function (response) {
            console.log("error getstatus : ", response);
        };
        //load status
        $scope.loadstatus = function () {
            //projectFactory.getprojectsbyuserid({ puser_user_id: sessionStorage.getItem('loginuserid') }).then(ongetsuccess, ongeterror);
            bugFactory.getstatus().then(ongetstatussuccess, ongetstatuserror);
        };


        //ongetsevesuccess
        var ongetsevesuccess = function (response) {
            console.log(" onsuccess getseverity : ", response);
            if (response) {
                if (response.data.Message) {
                    $scope.severitymodel = JSON.parse(response.data.Message);
                    console.log("$scope.severitymodel  : ", $scope.severitymodel);
                }
            }
        };

        //ongetseveerror
        var ongetseveerror = function (response) {
            console.log("error getseverity : ", response);
        };

        //load severity
        $scope.loadseverity = function () {
            //projectFactory.getprojectsbyuserid({ puser_user_id: sessionStorage.getItem('loginuserid') }).then(ongetsuccess, ongeterror);
            bugFactory.getseverity().then(ongetsevesuccess, ongetseveerror);
        };


        $scope.loadseverity();
        $scope.loadstatus();


        //ongetuserssuccess
        var ongetuserssuccess = function (response) {
            console.log(" onsuccess getusersbyprojid : ", response);
            if (response) {
                if (response.data.Message) {
                    console.log("users list : ", JSON.parse(response.data.Message))
                    $scope.assignedusers = JSON.parse(response.data.Message);
                    console.log("$scope.assignedusers  : ", $scope.assignedusers);
                }
            }

        };

        //ongetuserserror
        var ongetuserserror = function (response) {
            console.log("error getprojectbyuser : ", response);
        };

        var getassignedusers = function () {
            bugFactory.getassignedusers({ "user_proj_id": sessionStorage.getItem('proj_id') }).then(ongetuserssuccess, ongetuserserror);
        }

        getassignedusers();

        //edit bug
        //ongetbugdetailssuccess
        var ongetbugdetailssuccess = function (response) {
            NProgress.done();
            console.log(JSON.parse(response.data.Message));

            if (response) {
                if (response.data.Message) {
                    var responsedata = JSON.parse(response.data.Message);
                    $scope.buglistmodel = responsedata[0];

                    $scope.buglistmodel.bug_assignedto = $scope.buglistmodel.bug_assignedto.toString();
                    $scope.buglistmodel.bug_stat_id = $scope.bug_stat_id = $scope.buglistmodel.bug_stat_id.toString();
                    $scope.buglistmodel.bug_sev_id = $scope.buglistmodel.bug_sev_id.toString();
                    $scope.buglistmodel.bug_mod_id = $scope.buglistmodel.bug_mod_id.toString();


                    bugFactory.getmodule({ "mod_proj_id": sessionStorage.getItem('proj_id') }).then(ongetmodulesuccess, ongetmoduleerror);
                }
            }
        };


        //ongetbugdetailserror
        var ongetbugdetailserror = function (response) {
            console.log(JSON.parse(response.data.Message));
        };

        // update module
        var ongetmodulesuccess = function (response) {
            console.log(" onsuccess getmodules : ", response);
            if (response) {
                if (response.data.Message) {

                    $scope.modulemodel = JSON.parse(response.data.Message);
                }
            }
        };

        //onget module error
        var ongetmoduleerror = function (response) {
            console.log("error getmodules : ", response);
        };

        //get bug detailsbyid in update bug
        bugFactory.getbugdetailsbyid({ "bug_id": $scope.bug_id }).then(ongetbugdetailssuccess, ongetbugdetailserror);


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

        // History module
        var ongethistorysuccess = function (response) {
            console.log(" onsuccess getHistory : ", response);
            if (response.data.Message) {

                $scope.History = JSON.parse(response.data.Message);
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

                $scope.getStyle = function (status) {
                    if (status == 1)
                        return { 'color': '#dc3912'};
                    else if (status == 2)
                        return { 'color': '#ff9900'};
                    else if (status == 3)
                        return { 'color': '#109618'};
                    else if (status == 4)
                        return { 'color': '#990099'};
                    else if (status == 5)
                        return { 'color': '#0099c6'};
                    else if (status == 6)
                        return { 'color': '#66aa00'};
                    else if (status == 7)
                        return { 'color': '#dd4477'};


                };
            } else {
                $scope.error = !response.data.Message ? true : false;
                $scope.errorMsg = "No Comments";
            }
        };

        var ongethistoryerror = function (response) {
            console.log("error getComments : ", response);
        };

        $scope.comment = function () {

           
            //console.log("buglistmodel", $scope.buglistmodel);
            $scope.commentmodel.com_bug_id = $scope.buglistmodel.bug_id;
            $scope.commentmodel.com_proj_id = $scope.buglistmodel.bug_proj_id;
            $scope.commentmodel.user_id = sessionStorage.getItem('loginuserid');
            $scope.commentmodel.com_stat_id = $scope.buglistmodel.bug_stat_id;
            //$scope.buglistmodel.com_createdby = $scope.buglistmodel.bug_assignedto.toString();
            if ($scope.commentmodel.com_description != "") {
                bugFactory.comment($scope.commentmodel).then(oncommentsuccess, oncommenterror);
            }
            else
                ngToast.warning('please enter your comment');



        };


        $scope.getComments = function () {
            bugFactory.getComments({ "com_bug_id": $scope.bug_id }).then(ongetcommentsuccess, ongetcommenterror);
        }
        $scope.getComments();

        $scope.getHistory = function () {
            bugFactory.getHistory({ "com_bug_id": $scope.bug_id }).then(ongethistorysuccess, ongethistoryerror);
        }
        $scope.getHistory();


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



        // NOW UPLOAD THE FILES.
        //$scope.uploadFiles = function () {

        //    //FILL FormData WITH FILE DETAILS.
        //    var data = new FormData();

        //    for (var i in $scope.files) {
        //        data.append("uploadedFile", $scope.files[i]);
        //    };

        //    bugFactory.UploadFoodImages(data, function (resdata) {

        //        //document.getElementById('FileName').value = resdata;
        //        //seting return file name to scope logo and imagepath to bind
        //        // replacing double quotes with empty string
        //        resdata = resdata.replace(/['"]+/g, '');
        //        // spliting for logo i.e filename and image path
        //        $scope.buglistmodel.bug_attachment = resdata;
        //        var values = resdata.split(",");
        //        $scope.buglistmodel.bug_attachment = values[0];
        //        $scope.buglistmodel.attachmentpath = values[1];

        //        // refreshing the image path to image tag once new image path is loaded.
        //        $scope.$apply(function () {
        //            $scope.buglistmodel.attachmentpath = values[1];;
        //        });


        //    });

        //};

          });
});