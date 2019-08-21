

$(document).ready(function () {

    $(".confirmBtn").on('click', function () {

        $.ajax({
            type: 'post',
            url: '/acceptRequest',
            data: {
                'reqId': $(this).attr('data-val')
            },
            success: function (res) {

                res = JSON.parse(res);

                if(res.status === "ok")
                    document.location.href = "/myPlans";
                else {
                    alert("خطایی در انجام عملیات مورد نظر رخ داده است");
                }
            }
        })

    });

    $(".deleteBtn").on('click', function () {

        let id = $(this).attr('data-val');

        $.ajax({
            type: 'post',
            url: '/removeResponsible',
            data: {
                'id': id
            },
            success: function (res) {

                res = JSON.parse(res);

                if(res.status === "ok")
                    $("#tr_" + id).remove();
            }
        })

    });

    $(".redirectBtn").on('click', function () {
        document.location.href = "/showContentOfBlock/" + $(this).attr('data-val');
    });

});
