function channelFormatter(value, row, $element) {
    var html;
    //alert(row.ChannelCode);
    if (row.ChannelCode == '2')
    {
        html = '<div>' + 'Internet' + '</div>';
    }
    if (row.ChannelCode == 1)
    {
        html = '<div>' + 'ATM' + '</div>';
    }
    if (row.ChannelCode == 0) {
        html = '<div>' + 'Bank' + '</div>';
    }
    return html;
}

$('#Amount').priceFormat({
    prefix: 'NGN ',
    thousandsSeparator: ',',
    clearOnEmpty: true,
    clearPrefix: true
});


function valueFormatter(value, row, $element) {

    var format = parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var html = '<div class="price">' + format + '</div>';
    return html;

}
function dateFormatter(value, row, $element) {
    var format = moment(value).format("DD MMMM, YYYY");
    var html = '<div>' + format + '</div>';
    return html;
}
function percentageFormatter(value, row, $element) {
    
    var html = '<div>' +(row * 0.01) + '%'+ '</div>';
 
    return html;
}



customerDashboard = {

    initDashboardPageCharts: function () {

        var labelData = [];
        var withdrawSeriesData = [];
        var depositSeriesData = [];
        var transferSeriesData = [];
        
        /* ----------==========     Daily Sales Chart initialization    ==========---------- */
        $.ajax({
            url: '../Home/LabelandSeries',
            type: 'GET',
            success: function (result) {
                $.each(result, function (key, value) {
                    $.each(value, function (key, value) {

                        if (key == 'Month')
                        {
                            labelData.push(value);
                        }
                        if (key == 'WithdrawalTotal') {
                            withdrawSeriesData.push(value);
                        }
                        if (key == 'DepositTotal') {
                            depositSeriesData.push(value);
                        }
                        if (key == 'TransferTotal') {
                            transferSeriesData.push(value);
                        }
                    });
                  
                });

                // alert(labelData + ' :: ' +  withdrawSeriesData + ' :: ' + depositSeriesData + ' :: ' + transferSeriesData);
                var legendDiv = document.getElementById('chartLegend');
               
                //var jsonTransfer = [];
                //for (var i = 0 ; i < transferSeriesData.length; i++) {
                
                //    jsonTransfer.push({ meta:'transfer', value: transferSeriesData[i] }); //label + value respectively
                //}
             
                //jTransfer = JSON.stringify(jsonTransfer);
                //alert(jTransfer);

                debugger;
                dataMonthlyChart = {
                    labels: labelData, 
                    series:[withdrawSeriesData, depositSeriesData, transferSeriesData]
                };
                optionsMonthlyChart = {
                    lineSmooth: Chartist.Interpolation.cardinal({
                        tension: 0
                    }),
                    low: 0,
                    high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                    chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
                    showArea: true,
                    plugins: [
                           Chartist.plugins.tooltip(),
                           Chartist.plugins.legend({
                                legendNames: ['Withdrawals', 'Deposits', 'Transfers'],
                                position: legendDiv
                            }) 
                    ]};
                var responsiveOptions = [
                    ['screen and (max-width: 640px)', {
                      
                        axisX: {
                            labelInterpolationFnc: function (value) {
                                return value[0];
                            }
                        }
                    }]
                ];  
                var monthlyChart = new Chartist.Line('#monthlyChart', dataMonthlyChart, optionsMonthlyChart, responsiveOptions);
                md.startAnimationForLineChart(monthlyChart);
            },
            error: function (xhr, status, message) {
                //$responseArea = message;
            }
        });
       

      



        /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

        dataCompletedTasksChart = {
            labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
            series: [
                //[230, 750, 450, 300, 280, 240, 200, 190]
                      [0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };

        optionsCompletedTasksChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
        }

        var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

        // start animation for the Completed Tasks Chart - Line Chart
        md.startAnimationForLineChart(completedTasksChart);


        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

        var dataWebsiteViewsChart = {
            labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
            series: [
              //[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]
             [0, 0, 0, 0, 0, 0, 0, 36, 15, 0, 4, 1]
                    //yls

            ]
        };
        var optionsWebsiteViewsChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 1000,
            chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
        };
        var responsiveOptions = [
          ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                  labelInterpolationFnc: function (value) {
                      return value[0];
                  }
              }
          }]
        ];
        var websiteViewsChart = Chartist.Bar('#websiteViewsChart', dataWebsiteViewsChart, optionsWebsiteViewsChart, responsiveOptions);

        //start animation for the Emails Subscription Chart
        md.startAnimationForBarChart(websiteViewsChart);

},




}