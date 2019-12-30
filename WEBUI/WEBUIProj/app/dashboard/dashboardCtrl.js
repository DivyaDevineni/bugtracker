var dependencies = ['main', 'dashboard/dashboardFactory', 'common/masterdataFactory'];
define(dependencies, function (app, dashboardFactory) {
    app.controller("dashboardCtrl", function ($scope, $stateParams, $location, dashboardFactory, masterdataFactory, ngToast) {
        'use strict';

        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        NProgress.start();

        $scope.model = dashboardFactory.model();

        $scope.getbugs = function () {
            dashboardFactory.getBugs($scope.model).then(onGetBugsSuccess, onGetBugsError);
        };

        $scope.getprojects = function () {
            dashboardFactory.getProjects($scope.model).then(onGetProjectsSuccess, onGetProjectsError);
        };

        $scope.getseverity = function () {
            dashboardFactory.getSeverity($scope.model).then(onGetSeveritySuccess, onGetSeverityError);
        };



        var onGetBugsSuccess = function (response) {

            console.log("onGetBugsSuccess : ", response);

            if (response.data.Message != "") {

                $scope.dashboardBugs = JSON.parse(response.data.Message);

                var data = $scope.dashboardBugs;

                console.log("data : ", data);

                $scope.statusList = $scope.dashboardBugs[0];

                //Merging arrays into obj of array
                if ($scope.statusList.neww) {

                    var data = ($scope.statusList.neww).concat($scope.statusList.closed, $scope.statusList.tobetested, $scope.statusList.opened, $scope.statusList.inprogress, $scope.statusList.resolved, $scope.statusList.reopen);

                }
                else if ($scope.statusList.closed) {

                    var data = ($scope.statusList.closed).concat($scope.statusList.tobetested, $scope.statusList.opened, $scope.statusList.inprogress, $scope.statusList.resolved, $scope.statusList.reopen);

                }
                else if ($scope.statusList.tobetested) {

                    var data = ($scope.statusList.tobetested).concat($scope.statusList.opened, $scope.statusList.inprogress, $scope.statusList.resolved, $scope.statusList.reopen);

                }
                else if ($scope.statusList.opened) {

                    var data = ($scope.statusList.opened).concat($scope.statusList.inprogress, $scope.statusList.resolved, $scope.statusList.reopen);

                }

                else if ($scope.statusList.inprogress) {

                    var data = ($scope.statusList.inprogress).concat($scope.statusList.resolved, $scope.statusList.reopen);

                }
                else if ($scope.statusList.resolved) {

                    var data = ($scope.statusList.resolved).concat($scope.statusList.reopen);

                }
                else if ($scope.statusList.reopen) {

                    var data = $scope.statusList.reopen;

                }


                //Build the chart
                Highcharts.chart('bugsPerformance', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        name: 'Count',
                        colorByPoint: true,
                        data: data,
                        point: {
                            events: {


                            }
                        }
                    }]
                });

                // NProgress.done();


            }
        };


        var onGetSeveritySuccess = function (response) {

            console.log("onGetSeveritySuccess : ", response);

            if (response.data.Message != "") {

                $scope.dashboardSeverity = JSON.parse(response.data.Message);

                var data = $scope.dashboardSeverity;

                console.log("data : ", data);

                $scope.List = $scope.dashboardSeverity[0];

                //Merging arrays into obj of array
                if ($scope.List.major) {

                    var data = ($scope.List.major).concat($scope.List.minor, $scope.List.showstopper, $scope.List.critical);

                }
                else if ($scope.List.minor) {

                    var data = ($scope.List.minor).concat($scope.List.showstopper, $scope.List.critical);

                }
                else if ($scope.List.showstopper) {

                    var data = ($scope.List.showstopper).concat($scope.List.critical);

                }
                else if ($scope.List.critical) {

                    var data = ($scope.List.critical);
                }
                

                // Set up the chart
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'utility',
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        }
                    },
                    title: {
                        text: 'Major , Minor , Showstopper , critical'
                                 
                    },

                    tooltip: {
                        pointFormat: '<b>{series.name}</b>: <b>{point.y}</b>'
                    },

                    plotOptions: {
                        column: {
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: false,
                            depth: 60
                        }
                    },

                    yAxis: {

                        title: {
                            text: '<b>Range</b>'
                        },
                        labels: {
                            format: '{value}'
                        },
                        maxPadding: 0.01,
                        plotLines: [{

                            label: {
                                align: 'left',
                                style: {
                                    fontStyle: 'italic'
                                },
                                text: '',
                                x: -10
                            },

                        }]
                    },

                    series: [{
                        name: 'Severity count',
                        colorByPoint: true,
                        data: data
                    }]
                });

            }
        };

        var onGetProjectsSuccess = function (response) {

            console.log("onGetProjectsSuccess : ", response);

            if (response.data.Message != "") {

                $scope.dashboardProjects = JSON.parse(response.data.Message);

                var data = $scope.dashboardProjects;

                console.log("data : ", data);


                //Build the chart
                Highcharts.chart('Projectdetails', {

                    chart: {
                        type: 'bubble',
                        plotBorderWidth: 1,
                        zoomType: 'xy'
                    },

                    legend: {
                        enabled: false
                    },

                    title: {
                        text: 'Size of Bubble Represents Project Quantity'
                    },

                    subtitle: {
                        text: ''
                    },

                    xAxis: {
                        gridLineWidth: 1,
                        title: {
                            text: ''
                        },
                        labels: {
                            format: '{value}'
                        },
                        plotLines: [{
                            value: 0,
                            label: {
                                rotation: 0,
                                y: 15,
                                style: {
                                    fontStyle: 'italic'
                                },
                                text: ''
                            },
                            zIndex: 3
                        }]
                    },

                    yAxis: {
                        startOnTick: false,
                        endOnTick: false,
                        title: {
                            text: ''
                        },
                        labels: {
                            format: '{value}'
                        },
                        maxPadding: 0.2,
                        plotLines: [{

                            value: 50,
                            label: {
                                align: 'right',
                                style: {
                                    fontStyle: 'italic'
                                },
                                text: '',
                                x: -10
                            },
                            zIndex: 3
                        }]
                    },

                    tooltip: {
                        useHTML: true,
                        headerFormat: '<table>',
                        pointFormat: '<tr><th colspan="2"><h3>{point.proj_name}</h3></th></tr>' +
                            '<tr><th>New    :</th><td>{point.x}</td></tr>' +
                            '<tr><th>Closed :</th><td>{point.y}</td></tr>' +
                            '<tr><th>Opened :</th><td>{point.z}</td></tr>',
                        footerFormat: '</table>',
                        followPointer: true
                    },

                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            }
                        }
                    },

                    series: [{
                        colorByPoint: true,
                        data: data
                    }]

                });

                NProgress.done();


            }
        };



        var onGetProjectsError = function (response) {
            console.log("onGetProjectsError :", response);
        };

        var onGetBugsError = function (response) {
            console.log("onGetBugsError :", response);
        };

        var onGetSeverityError = function (response) {
            console.log("onGetSeverityError :", response);
        };

        $scope.getbugs();
        $scope.getprojects();
        $scope.getseverity();

    });
});