
$("#inst").on("change", function () {
    getRows();
});

$("document").ready(function () {
    getRows();
});

function getRows() {

    $.ajax({
        url: '/getMyPlans',
        type: 'post',
        data: {
            'instId': $("#inst").val()
        },
        success: function (res) {

            res = JSON.parse(res);
            let newElement = "";

            for(let i = 0; i < res.length; i++) {
                newElement += "<tr>";
                newElement += "<td></td><td>" + (i + 1) + "</td>";
                newElement += "<td>" + res[i].step + "</td>";
                newElement += "<td>" + res[i].kargroh + "</td><td>" + res[i].createdAt + "</td>";
                newElement += "<td>" + res[i].complete + " - " + res[i].reminder + "</td><td>" + res[i].percent + "</td>";
                newElement += "<td>ناموجود</td><td>ناموجود</td>";
                newElement += "<td>ناموجود</td>";
                newElement += "</tr>";
            }

            if(res.length > 0) {
                $("#code").empty().append(res[0].code);
            }

            $("#tbody").empty().append(newElement);
        }
    });
}