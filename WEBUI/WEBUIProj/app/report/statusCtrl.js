var dependencies = ['main', 'report/reportFactory', 'common/masterdataFactory'];
define(dependencies, function (app, reportFactory) {

    app.controller("statusCtrl", function ($scope, $stateParams, $location, reportFactory, masterdataFactory, ngToast) {
        'use strict';

        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        var series = [];


        $scope.statusreportmodel = {


        };

        NProgress.start();

        $scope.getstatusReport = function () {

            var inputjson = {

                "bug_proj_id": sessionStorage.getItem('proj_id'),

            };
            reportFactory.statusreport(inputjson).then(onGetReportSuccess, onGetReportError);
        }

        var onGetReportSuccess = function (response) {

            console.log("onGetReportSuccess : ", response);

            if (response.data.Message != "") {

                $scope.StatusReports = JSON.parse(response.data.Message);

                console.log("$scope.StatusReports : ", $scope.StatusReports);

                $scope.statusList = $scope.StatusReports[0];

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

                //converting object to array
                var res = [];
                for (var x in data) {
                    res.push(data[x])
                }
                console.log(res);


                //Build the Chart
                Highcharts.chart('container', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: 'Bugs Count based on Status'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        name: 'Count',
                        colorByPoint: true,
                        data: res,
                        point: {
                            events: {

                                //Selecting perticular value on chart
                                click: function (event) {

                                    if ($scope.statusList.neww) {
                                        var stat_id = this.status_id;
                                    }

                                    else if ($scope.statusList.closed) {

                                        var stat_id = $scope.statusList.closed[0].status_id;

                                    }

                                    else if ($scope.statusList.tobetested) {

                                        var stat_id = $scope.statusList.tobetested[0].status_id;

                                    }

                                    else if ($scope.statusList.opened) {

                                        var stat_id = $scope.statusList.opened[0].status_id;

                                    }

                                    else if ($scope.statusList.inprogress) {

                                        var stat_id = $scope.statusList.inprogress[0].status_id;

                                    }

                                    else if ($scope.statusList.resolved) {

                                        var stat_id = $scope.statusList.resolved[0].status_id;

                                    }

                                    else if ($scope.statusList.reopen) {

                                        var stat_id = $scope.statusList.reopen[0].status_id;

                                    }

                                    $scope.bug_stat_id = stat_id;


                                    sessionStorage.setItem('bug_stat_id', $scope.bug_stat_id);

                                    var inputjson = {

                                        "bug_proj_id": sessionStorage.getItem('proj_id'),
                                        "bug_stat_id": $scope.bug_stat_id

                                    };
                                    reportFactory.statusbyuser(inputjson).then(onGetstatus_Success, onGetstatus_Error);

                                }
                            }
                        }
                    }]
                });
                NProgress.done();



                //    google.charts.load('current', { 'packages': ['corechart'] });
                //    google.charts.setOnLoadCallback(drawChart);

                //    function drawChart() {


                //        //Binding data to table
                //        var datatable = new google.visualization.DataTable();

                //        datatable.addColumn('string', 'Status');
                //     //   datatable.addColumn('number', 'Bug Sequence');
                //        datatable.addColumn('number', 'Bugs Count');

                //        $('table tr').not(':first').each(function (i, tr) {
                //            datatable.addRow([
                //               $(tr).find('.status').text(),
                //               // parseInt($(tr).find('.id').text()),
                //                 parseInt($(tr).find('.count').text())
                //            ]);
                //        });

                //         //var options = {
                //         //   title: 'Assignees',
                //         //   pieHole: 0.4,
                //         //   sliced: true,
                //         //   slices: { 0: { color: '#7CB5EC' }, 1: { color: '#449F24' }, 2: { color: '#CC0000' }, 3: { color: '#FFCC00' }, 4: { color: 'grey' } }

                //         //};

                //         var options = {
                //             title: 'Bugs Count based on Status',
                //          //   backgroundColor: '#E4E4E4',
                //             pieSliceText: 'label',
                //             colors: ['#7CB5EC', '#ff6666', '#a5f28a', '#FFCC00', 'grey', 'cyan', 'magenta'],
                //             slices: {
                //                 1: { offset: 0.1 },
                //                 2: { offset: 0.1 },
                //                 3: { offset: 0.1 },
                //                 4: { offset: 0.2 },
                //                 5: { offset: 0.1 },
                //                 6: { offset: 0.1 }
                //             },
                //         };

                //         var chart = new google.visualization.PieChart(document.getElementById('piechart'));



                //        //For selecting perticular user in chart
                //        function selectHandler() {
                //            var selection = chart.getSelection();
                //            if (selection.length) {
                //                var name = datatable.getValue(selection[0].row, 0);

                //                $scope.statusList = $scope.StatusReports[0];

                //                console.log(" $scope.statusList : ", $scope.statusList);


                //                if ($scope.statusList.neww && $scope.statusList.neww[0].status_name == name) {

                //                    var stat_id = $scope.statusList.neww[0].status_id;

                //                }


                //                else if ($scope.statusList.closed && $scope.statusList.closed[0].status_name == name) {

                //                    var stat_id = $scope.statusList.closed[0].status_id;

                //                }

                //                else if ($scope.statusList.tobetested && $scope.statusList.tobetested[0].status_name == name) {

                //                    var stat_id = $scope.statusList.tobetested[0].status_id;

                //                }

                //                else if ($scope.statusList.opened && $scope.statusList.opened[0].status_name == name) {

                //                    var stat_id = $scope.statusList.opened[0].status_id;

                //                }

                //                else if ($scope.statusList.inprogress && $scope.statusList.inprogress[0].status_name == name) {

                //                    var stat_id = $scope.statusList.inprogress[0].status_id;

                //                }

                //                else if ($scope.statusList.resolved && $scope.statusList.resolved[0].status_name == name) {

                //                    var stat_id = $scope.statusList.resolved[0].status_id;

                //                }

                //                else if ($scope.statusList.reopen && $scope.statusList.reopen[0].status_name == name) {

                //                    var stat_id = $scope.statusList.reopen[0].status_id;

                //                }

                //                $scope.bug_stat_id = stat_id;

                //            }
                //            sessionStorage.setItem('bug_stat_id', $scope.bug_stat_id);

                //            var inputjson = {

                //                "bug_proj_id": sessionStorage.getItem('proj_id'),
                //                "bug_stat_id": $scope.bug_stat_id

                //            };
                //            reportFactory.statusbyuser(inputjson).then(onGetstatus_Success, onGetstatus_Error);

                //        }
                //        google.visualization.events.addListener(chart, 'select', selectHandler);

                //        chart.draw(datatable, options);
                //    }
                //    NProgress.done();
            }


        };


        var onGetReportError = function (response) {
            console.log("onGetReportError :", response);
        };

        var onGetstatus_Success = function (response) {
            console.log("onGetReport_userSuccess : ", response);

            $location.path('bug/' + $scope.bug_stat_id);



        };

        var onGetstatus_Error = function (response) {
            console.log("onGetReport_userError :", response);
        };

        $scope.getstatusReport();

    });



});

