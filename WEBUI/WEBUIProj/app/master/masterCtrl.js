(function () {
    define(['main', 'bootstrap', 'select2', 'uiGrid'], function ($location, $rootScope) {
        'use strict';
        return function ($state, $location, $rootScope, $scope, $http, $window, apiFactory) {


            var globalapptype = 'kid';    //"fleet/kid"

            //$(document).ready(function () {
            //    //$("div.navbar-right ul li a")
            //    // .mouseover(function () {
            //    //     $(this).addClass('mouseover');
            //    // })
            //    // .mouseout(function () {
            //    //     $(this).removeClass('mouseover');
            //    // });

            //    $("div.navbar-right ul li a").click(function (e) {
            //        e.preventDefault(); //prevent the link from actually navigating somewhere
            //        $(this).toggleClass("active");
            //        $("div.navbar-right ul li a").not(this).removeClass("active"); //remove the clicked class from all other elements
            //    });
            //});
            var selector = '.navbar-nav li';

            $(selector).on('click', function () {
                $(selector).removeClass('active');
                $(this).addClass('active');
            });

            $scope.counter = function () {
                $({ countNum: $('#counter').text() }).animate({ countNum: $scope.totalusersinproject }, {
                    from: 50,
                    duration: 1000,
                    easing: 'linear',
                    step: function () {
                        $('#counter').text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $('#counter').text(this.countNum);
                        //alert('user count finished');
                    }
                });

                $({ countNum: $('#counter1').text() }).animate({ countNum: $scope.totalProjects }, {
                    from: 50,
                    duration: 1000,
                    easing: 'linear',
                    step: function () {
                        $('#counter1').text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $('#counter1').text(this.countNum);
                        //alert('finished');
                    }
                });

                $({ countNum: $('#counter2').text() }).animate({ countNum: $scope.totalbugs }, {
                    from: 50,
                    duration: 1000,
                    easing: 'linear',
                    step: function () {
                        $('#counter2').text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $('#counter2').text(this.countNum);
                        //    alert('finished');
                    }
                });
            };


            $scope.projects = function () {
                $location.path('project');
            };
            //require(['customJs']);


            //$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
            //    //assign the "from" parameter to something  

            //    if (from.url == "/login") {


            //    }
            //});

            //
            //var profile = JSON.parse(sessionStorage.getItem('profile'));
            //if (!profile.isadmin && !profile.issuperadmin) {
            //    var user_type = profile.user_usertype;
            //    if (user_type == "parent") {
            //        $scope.isparent = "true";
            //    }
            //    else {
            //        $scope.isaparent = "false";
            //    }
            //}


            // implementing the function outside so we can get subsxcripton List and View Trip after reloading

            $scope.progress = function () {
                document.getElementById("overlay").style.display = "block";
                // setTimeout(hide, 1000);

            };

            //function hide() {
            //    document.getElementById("overlay").style.display = "none";
            //}
            $scope.GetProjects = function (force) {
                if (force || $scope.projects.length == 0) {
                    $http({
                        method: "POST",
                        url: 'http://ec2-52-89-83-54.us-west-2.compute.amazonaws.com:81/api/project/getprojectsbyuser',
                        //url: $location.protocol()+"://localhost:54326/api/project/getprojectsbyuser",
                        data: { puser_user_id: sessionStorage.getItem('loginuserid') },
                        headers: {
                            "Authorization": sessionStorage.getItem('token'),
                            "DeviceName": navigator.userAgent
                        }
                    })
                .then(onGetProjSuccess, onGetProjError);
                }
            };
            //$scope.GetProjects();

            var onGetProjSuccess = function (response) {
                console.log(" onsuccess getprojectbyuser : ", response);
                if (response.data.Message) {
                    $scope.projects = JSON.parse(response.data.Message);
                    console.log("$scope.projects  : ", $scope.projects);
                    $scope.totalProjects = $scope.projects.length;
                    $scope.counter();
                    if (sessionStorage.getItem('proj_id') != 'null' && $scope.model.proj_id == "") {
                        $scope.model.proj_id = sessionStorage.getItem('proj_id');
                    }
                    else if (sessionStorage.getItem('proj_id') == 'null' || sessionStorage.getItem('proj_id') == '0') {
                        sessionStorage.setItem('proj_id', $scope.projects[0].proj_id);
                        $scope.model.proj_id = $scope.projects[0].proj_id.toString();
                        sessionStorage.setItem('puser_role', $scope.projects[0].puser_role);
                        $scope.isowner = (sessionStorage.getItem('puser_role') == "owner") ? true : false;
                        $scope.ismanager = (sessionStorage.getItem('puser_role') == "Manager") ? true : false;

                    }
                   
                } else {
                    $scope.projects = [];
                    $scope.totalProjects = $scope.projects.length;
                    $scope.counter();
                }
            };

            var onGetProjError = function (response) {
                console.log("error getprojectbyuser : ", response);
            };

            $scope.getUsers = function () {
                if ($scope.isowner || $scope.ismanager) {
                    $location.path('viewuser');
                } else {
                    angular.element('#users').addClass('disabled');
                }
            };


            $scope.tochangepassword = function () {
                $location.path("changepassword");
            }

            $scope.Logout = function () {
                require.undef('customJs');
                sessionStorage.removeItem('loginuserid');
                sessionStorage.removeItem('loginaccountid');
                sessionStorage.removeItem('usertype');
                sessionStorage.removeItem('proj_id');
                sessionStorage.removeItem('profile');
                $scope.projects = [];
                $scope.isAuth = false;
                $location.path("login");
            };

            var profile = null;
            $scope.name = '';
            $scope.issuperadmin = false;
            $scope.admin = false;
            $scope.model = { proj_id: "" };
            $scope.projects = [];

            if (!sessionStorage.getItem('loginuserid')) {
                $scope.Logout();
            }
            else {
                $scope.isAuth = true;
                //$scope.ismanager = false;
                //$scope.isowner = false;
                var profileresponse = JSON.parse(sessionStorage.getItem('profile'));
                $scope.profile = profile = profileresponse[0];
                $scope.profilename = profile.user_username;
                $scope.profilelogo = profile.user_logo;
                $scope.profilepath = profile.logopath;
                var user_createddate = moment.utc($scope.profile.user_createddate, "YYYY-MM-DD HH:mm");
                $scope.user_createddate = moment(user_createddate._d).format('MMM. YYYY');

                //var start = moment.utc($scope.profile.user_createddate, "YY MMM Do");
                //$scope.user_createddate = moment(start._d).format('YY MMM Do');

                if (!profile.user_username) {
                    $scope.profilename = profile.user_emailid;
                }

                sessionStorage.setItem('loginuserid', $scope.profile.user_id);
                sessionStorage.setItem('loginaccountid', $scope.profile.user_acco_id);
                sessionStorage.setItem('usertype', profile.user_usertype);
                if ($scope.profile.puserprojid.puser_proj_id == 0) {
                    $scope.totalusersinproject = 0;
                } else {
                    $scope.totalusersinproject = sessionStorage.getItem('totalusersinproj');
                }
                $scope.totalbugs = sessionStorage.getItem('totalbugsinproj');
                $scope.projName = sessionStorage.getItem('proj_name');
                $scope.isowner = (sessionStorage.getItem('puser_role') == "owner") ? true : false;
                $scope.ismanager = (sessionStorage.getItem('puser_role') == "Manager") ? true : false;

                if (sessionStorage.getItem('proj_id') != 'null')
                    $scope.model.proj_id = sessionStorage.getItem('proj_id');

                $scope.GetProjects();
                //$scope.counter($scope.totalProjects);
                //$scope.GetAccounts();

                try {
                    require.undef('customJs');
                } catch (e) {

                }
                require(['customJs']);
            }



            var ignoreCtrls = ["loginCtrl", "resetpasswordCtrl"];


            console.log('loading master');


            $rootScope.$on("Login", function () {
                debugger;
                $scope.isAuth = true;
                //$scope.ismanager = false;
                //$scope.isowner = false;
                var profileresponse = JSON.parse(sessionStorage.getItem('profile'));
                $scope.profile = profile = profileresponse[0];
                $scope.profilename = profile.user_username;
                $scope.profilelogo = profile.user_logo;
                $scope.profilepath = profile.logopath;
                $scope.title = "Bugs";
                //$scope.puser_role = profile.puserrole.puser_role;

                console.log("$scope.profilename", $scope.profilename);
                if (!profile.user_username) {
                    $scope.profilename = profile.user_emailid;
                }

                var user_createddate = moment.utc($scope.profile.user_createddate, "YYYY-MM-DD HH:mm");
                $scope.user_createddate = moment(user_createddate._d).format('MMM. YYYY');

                //var start = moment.utc($scope.profile.user_createddate, "YY MMM Do");
                //$scope.user_createddate = moment(start._d).format('YY MMM Do');

                sessionStorage.setItem('proj_id', $scope.profile.puserprojid.puser_proj_id);
                sessionStorage.setItem('loginuserid', $scope.profile.user_id);
                sessionStorage.setItem('loginaccountid', $scope.profile.user_acco_id);
                sessionStorage.setItem('usertype', profile.user_usertype);
                sessionStorage.setItem('puser_role', profile.puserprojid.puser_role);
                sessionStorage.setItem('totalusersinproj', profile.usercount.count);
                sessionStorage.setItem('totalbugsinproj', profile.bugcount.count);
                sessionStorage.setItem('proj_name', profile.proj_name);
                $scope.model.proj_id = profile.puserprojid.puser_proj_id.toString();
                $scope.totalusersinproject = sessionStorage.getItem('totalusersinproj');
                $scope.totalbugs = sessionStorage.getItem('totalbugsinproj');
                $scope.projName = sessionStorage.getItem('proj_name');
                $scope.GetProjects();
                if ($scope.profile.puserprojid.puser_proj_id == 0) {
                    $scope.totalusersinproject = 0;
                    $location.path("home");
                }
                else {
                    $location.path("bug");
                }
                $scope.isowner = (sessionStorage.getItem('puser_role') == "owner") ? true : false;
                $scope.ismanager = (sessionStorage.getItem('puser_role') == "Manager") ? true : false;    
            });

            $scope.ProjectChanged = function () {
                if ($scope.model.proj_id != 'null') {
                    // sessionStorage.setItem('proj_id', $scope.model.proj_id);

                    // for refreshing account logo
                    if ($scope.model.proj_id != null) {


                        sessionStorage.setItem('proj_id', $scope.model.proj_id);

                    }
                    else {
                        $scope.model.proj_id = sessionStorage.getItem('proj_id');
                    }
                    //$scope.ismanager = ($scope.model.puser_role == "manager") ? true : false;
                    //if ($scope.model.puser_role == "manager" || $scope.model.puser_role == "owner") {
                    //    $scope.ismanager = true;
                    //    $scope.isowner = true;
                    //}

                    for (var i = 0 ; i < $scope.projects.length; i++) {
                        var projectdata = $scope.projects[i];

                        if (projectdata.proj_id == $scope.model.proj_id) {
                            console.log("projectdata : ", projectdata);

                            //these sessionStorages loads when account dropdown is changed.
                            sessionStorage.setItem('proj_id', $scope.model.proj_id);
                            sessionStorage.setItem('puser_role', projectdata.puser_role);
                            sessionStorage.setItem('totalusersinproj', projectdata.usercount.count);
                            sessionStorage.setItem('totalbugsinproj', projectdata.bugcount);
                            sessionStorage.setItem('proj_name', projectdata.proj_name);
                            //$scope.totalusersinproject = projectdata.usercount.count;
                            //$scope.totalbugs = projectdata.bugcount.count;
                            //sessionStorage.setItem('acco_logo', projectdata.acco_logo);
                            //sessionStorage.setItem('acco_name', projectdata.name);

                            $scope.ismanager = (projectdata.puser_role == "Manager") ? true : false;
                            $scope.isowner = (projectdata.puser_role == "owner") ? true : false;


                        }
                    }
                }
                $window.location.reload();
            };


            $rootScope.$on("RefreshProjects", function (uniqueid) {
                $scope.GetProjects(true);
            });


            //if (sessionStorage.getItem('apptype') == 'fleet') {
            //    $scope.AppName = "FleetConnect";
            //    $scope.appimg = "FClogo5_icon.png";
            //    //$scope.kid = false;
            //    if (profile) {
            //        $scope.profilepic = profile.accologopath + sessionStorage.getItem('acco_logo');
            //    }

            //} else {
            //    $scope.AppName = "KidConnect";
            //    //$scope.appimg = "KC2.png";
            //    $scope.appimg = "KC2_ICON.png";
            //    //$scope.kid = true;
            //    if (profile)
            //    {
            //        $scope.profilepic = profile.accologopath + sessionStorage.getItem('acco_logo');
            //        hideshowViewtripSubscriptionlist();
            //    }

            //}

        }
    });
}());