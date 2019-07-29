
$(document).ready(function () {

    $.ajax({
        type: 'post',
        url: '/getTotalDoneRequests',
        success: function (res) {
            $("#totalDoneRequest").append(res);
        }
    });

    $.ajax({
        type: 'post',
        url: '/getTotalRequests',
        success: function (res) {
            $("#totalRequests").append(res);
        }
    });

    $.ajax({
        type: 'post',
        url: '/getTotalVisits',
        success: function (res) {

            let arr = [];
            res = JSON.parse(res);
            let total = 0;

            for (let i = 0; i < res.length; i++) {
                arr[i] = res[i].totalSum;
                total += parseInt(res[i].totalSum);
            }

            $("#totalVisits").append(total);

            $("#sparkline26").sparkline(arr, {
                type: 'line',
                width: '100%',
                height: '60',
                lineColor: '#ed5565',
                fillColor: "#ebebeb"
            });
        }
    });

    $.ajax({
        type: 'post',
        url: '/getVisitsPerURL',
        success: function (res) {
            res = JSON.parse(res);

            let newElement = "";

            for(let i = 0; i < res.length; i++) {
                newElement += "<div class='col-lg-3 col-md-3 col-sm-6 col-xs-12' style='margin-bottom: 30px'>";
                newElement += "<div class='analytics-rounded ant-res-b-30 shadow-reset'>";
                newElement += "<div class='analytics-rounded-content'>";
                newElement += "<h5>" +  res[i].url + "</h5>";
                newElement += "<h2><span class='counter'>" + res[i].total + "</span></h2>";
                newElement += "<div class='text-center'><div id='sparkline" + (1 + i) + "'></div></div>";
                newElement += "</div>";
                newElement += "</div>";
                newElement += "</div>";
            }

            $("#perURLDiv").append(newElement);

            for(let i = 0; i < res.length; i++) {
                $("#sparkline" + (i + 1)).sparkline(res[i].data, {
                    type: 'line',
                    width: '100%',
                    height: '60',
                    lineColor: '#ed5565',
                    fillColor: "#ebebeb"
                });
            }

            $.ajax({
                type: 'post',
                url: '/getTotalRequestsPerInstructions',
                success: function (res) {
                    res = JSON.parse(res);

                    let newElement = "";

                    for(let i = 0; i < res.length; i++) {

                        newElement += "<div class='col-lg-3 col-md-3 col-sm-6 col-xs-12'>";
                        newElement += "<div class='analytics-rounded ant-res-b-30 shadow-reset'>";
                        newElement += "<div class='analytics-rounded-content'>";
                        newElement += "<h5>" +  res[i].name + "</h5>";
                        newElement += "<h2><span class='counter'>" + res[i].total_request + "</span>" + " / <span>" + res[i].total_request_queue +"</span></h2>";
                        newElement += "<div class='text-center'><div id='sparkline" + (100 + i) + "'></div></div>";
                        newElement += "</div>";
                        newElement += "</div>";
                        newElement += "</div>";

                    }

                    $("#perInstructionsDiv").empty().append(newElement);

                    for(let i = 0; i < res.length; i++) {
                        $("#sparkline" + (100 + i)).sparkline([parseInt(res[i].total_request_queue), parseInt(res[i].total_request) + parseInt(res[i].total_request_queue)], {
                            type: 'pie',
                            height: '140',
                            sliceColors: ['#1ab394', '#ebebeb']
                        });
                    }
                }
            });
        }
    });
});
