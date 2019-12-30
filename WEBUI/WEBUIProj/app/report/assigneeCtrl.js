var dependencies = ['main', 'report/reportFactory', 'common/masterdataFactory'];
define(dependencies, function (app, reportFactory) {

    app.controller("assigneeCtrl", function ($scope, $stateParams, $location, reportFactory, masterdataFactory, ngToast) {
        'use strict';


        console.log("$scope.$parent.isAuth", $scope.$parent.isAuth);

        if (!$scope.$parent.isAuth) {
            $location.path("login");
            return;
        }

        NProgress.start();

        $scope.assigneereportmodel = {


        };

        $scope.loc = function () {

            $location.path('bug/' + $scope.bug_assignedto + "/" + $scope.bug_stat_id);

        }

        $scope.getassigneeReport = function () {

            var inputjson = {

                "bug_proj_id": sessionStorage.getItem('proj_id'),
                "bug_stat_id": "2"

            };
            reportFactory.assigneereport(inputjson).then(onGetReportSuccess, onGetReportError);
        }

        var onGetReportSuccess = function (response) {


            console.log("onGetReportSuccess : ", response);

            if (response.data.Message != "") {

                $scope.AssigneeReports = JSON.parse(response.data.Message);

                console.log("$scope.AssigneeReports : ", $scope.AssigneeReports);

                var data = $scope.AssigneeReports[0].assignee;

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
                        text: 'Bugs Closed by the Assignees'
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
                        keys: ['name', 'y', 'selected', 'sliced'],

                        colorByPoint: true,
                        data: res,
                        point: {
                            events: {

                                //Selecting perticular value on chart
                                click: function (event) {

                                    $scope.bug_stat_id = this.bug_stat_id;
                                    $scope.bug_assignedto = this.user_id;

                                    sessionStorage.setItem('bug_assignedto', $scope.bug_assignedto);
                                    sessionStorage.setItem('bug_stat_id', $scope.bug_stat_id);

                                    var inputjson = {

                                        "bug_proj_id": sessionStorage.getItem('proj_id'),
                                        "user_id": sessionStorage.getItem('bug_assignedto'),
                                        "bug_stat_id": $scope.bug_stat_id

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

                //    datatable.addColumn('string', 'Assignee');
                //    datatable.addColumn('number', 'Count');

                //    $('table tr').not(':first').each(function (i, tr) {
                //        datatable.addRow([
                //           $(tr).find('.assignee').text(),
                //           parseInt($(tr).find('.count').text())
                //        ]);
                //    });

                //    var options = {
                //        title: 'Bugs Closed by the Assignees',
                //        pieHole: 0.4,
                //      //  backgroundColor: '#E4E4E4',
                //        sliced: true,
                //        slices: { 0: { color: '#7CB5EC' }, 1: { color: '#ff6666' }, 2: { color: '#a5f28a' }, 3: { color: '#FFCC00' }, 4: { color: 'grey' }, 5: { color: 'cyan' }, 6: { color: 'magenta' } }

                //    };

                //    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

                //    //For selecting perticular user in chart
                //    function selectHandler() {
                //        var selection = chart.getSelection();
                //        if (selection.length) {
                //            var name = datatable.getValue(selection[0].row, 0);

                //            $scope.userList = $scope.AssigneeReports[0].assignee;

                //            console.log(" $scope.userList : ", $scope.userList);


                //            for (var i = 0, len = $scope.userList.length; i < len; i++) {
                //                if ($scope.userList[i].user_username == name || $scope.userList[i].user_emailid == name) {

                //                    var stat_id = $scope.userList[i].bug_stat_id;
                //                    var id = $scope.userList[i].user_id;

                //                }

                //                $scope.bug_stat_id = stat_id;
                //                $scope.bug_assignedto = id;


                //            }

                //        }
                //        sessionStorage.setItem('bug_assignedto', $scope.bug_assignedto);
                //        sessionStorage.setItem('bug_stat_id', $scope.bug_stat_id);

                //        var inputjson = {

                //            "bug_proj_id": sessionStorage.getItem('proj_id'),
                //            "user_id": sessionStorage.getItem('bug_assignedto'),
                //            "bug_stat_id": $scope.bug_stat_id

                //        };
                //        reportFactory.reporterbyuser(inputjson).then(onGetReport_userSuccess, onGetReport_userError);


                //    }
                //    google.visualization.events.addListener(chart, 'select', selectHandler);


                //    chart.draw(datatable, options);
                //  }
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


        $scope.getassigneeReport();


    });
});