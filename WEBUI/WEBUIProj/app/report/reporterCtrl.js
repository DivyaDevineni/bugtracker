var dependencies = ['main', 'report/reportFactory', 'common/masterdataFactory'];
define(dependencies, function (app, reportFactory) {
    app.controller("reporterCtrl", function ($scope, $stateParams, $location, reportFactory, masterdataFactory, ngToast) {
        'use strict';

        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        NProgress.start();

        $scope.reporterreportmodel = {

        };


        $scope.loc = function () {

            $location.path('bug/user/id/' + $scope.selectedid);

        }

        $scope.getreporterReport = function () {

            var inputjson = {

                "bug_proj_id": sessionStorage.getItem('proj_id'),

            };

            reportFactory.reporterreport(inputjson).then(onGetReportSuccess, onGetReportError);
        }

        var onGetReportSuccess = function (response) {

            console.log("onGetReportSuccess : ", response);

            if (response.data.Message != "") {

                $scope.ReporterReports = JSON.parse(response.data.Message);

                var data = $scope.ReporterReports[0].reporter;

                console.log("data : ", data);

                $scope.reporterreportmodel.count = data;

                var data = $scope.reporterreportmodel.count;

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
                        text: 'Bugs reported by the Reporters'
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
                    slices: {
                        1: { offset: 0.1 },
                        2: { offset: 0.1 },
                        3: { offset: 0.2 },
                        15: { offset: 0.5 },
                    },
                    series: [{
                        name: 'Count',
                        colorByPoint: true,
                        data: res,
                        point: {
                            events: {

                                //Selecting perticular value on chart
                                click: function (event) {

                                    $scope.selectedid = this.user_id

                                    sessionStorage.setItem('selectedid', $scope.selectedid);
                                    var inputjson = {

                                        "bug_proj_id": sessionStorage.getItem('proj_id'),
                                        "user_id": sessionStorage.getItem('selectedid')

                                    };
                                    reportFactory.reporterbyuser(inputjson).then(onGetReport_userSuccess, onGetReport_userError);

                                }
                            }
                        }
                    }],
                });
                NProgress.done();

                //google.charts.load('current', { 'packages': ['corechart'] });
                //google.charts.setOnLoadCallback(drawChart);

                //function drawChart() {


                //    //Binding data to table
                //    var datatable = new google.visualization.DataTable();

                //    datatable.addColumn('string', 'Reporter');
                //    datatable.addColumn('number', 'Count');

                //    // for binding data to chart
                //    $('table tr').not(':first').each(function (i, tr) {
                //        datatable.addRow([
                //           $(tr).find('.reporter').text(),
                //           parseInt($(tr).find('.count').text())


                //        ]);
                //    });

                //    var options = {
                //        title: 'Bugs reported by the Reporter',
                //        is3D: true,
                //       // backgroundColor: '#E4E4E4',
                //      //  chartArea:{left:20,top:0,width:'50%',height:'75%'},
                //        slices: { 0: { color: '#7CB5EC' }, 1: { color: '#ff6666' }, 2: { color: '#a5f28a' }, 3: { color: '#FFCC00' }, 4: { color: 'grey' }, 5: { color: 'cyan' }, 6: { color: 'magenta' } }


                //    };

                //    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

                //    //For selecting perticular user in chart
                //    function selectHandler() {
                //        var selection = chart.getSelection();
                //        if (selection.length) {
                //            var name = datatable.getValue(selection[0].row, 0);

                //            $scope.userList = $scope.ReporterReports[0].reporter;

                //            for (var i = 0, len = $scope.userList.length; i < len; i++) {

                //                if ($scope.userList[i].user_username == name || $scope.userList[i].user_emailid == name) {

                //                    var id = $scope.userList[i].user_id;

                //                }

                //                $scope.selectedid = id;
                //            }

                //        }
                //        sessionStorage.setItem('selectedid', $scope.selectedid);

                //        var inputjson = {

                //            "bug_proj_id": sessionStorage.getItem('proj_id'),
                //            "user_id": sessionStorage.getItem('selectedid')

                //        };
                //        reportFactory.reporterbyuser(inputjson).then(onGetReport_userSuccess, onGetReport_userError);


                //    }
                //    google.visualization.events.addListener(chart, 'select', selectHandler);


                //    chart.draw(datatable, options);

                //}
                // NProgress.done();
            }
        };

        var onGetReportError = function (response) {
            console.log("onGetReportError :", response);
        };


        var onGetReport_userSuccess = function (response) {
            console.log("onGetReport_userSuccess : ", response);

            $scope.loc();

        };

        var onGetReport_userError = function (response) {
            console.log("onGetReport_userError :", response);
        };

        $scope.getreporterReport();

    });
});