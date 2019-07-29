
let kargroh;
let oldName = "";

$(document).ready(function () {
    oldName = $("#name").val();
});

$("#name").on('focusout', function () {

    kargroh = $("#name").val();

    if(oldName !== kargroh) {
        $.ajax({
            type: 'post',
            url: '/updateKargroh',
            data: {
                'oldName': oldName,
                'newName': kargroh
            }
        });
        oldName = kargroh;
    }
});

$("#addToLoggerBtn").on('click', function () {

    kargroh = $("#name").val();

    if(kargroh === "-1" || kargroh.length === 0) {
        alert("لطفا ابتدا نام کار گروه مورد نظر خود را وارد نمایید");
        return;
    }

    let userId = $("#usersList").val();

    if(userId == null || userId.length === 0) {
        alert("لطفا عضو مورد نظر خود را انتخاب نمایید");
        return;
    }

    if(oldName !== kargroh) {
        $.ajax({
            type: 'post',
            url: '/updateKargroh',
            data: {
                'oldName': oldName,
                'newName': kargroh
            }
        });
        oldName = kargroh;
    }

    for(let k = 0; k < userId.length; k++) {
        $.ajax({
            type: 'post',
            url: '/addToKargroh',
            data: {
                'logger': 'on',
                'user_id': userId[k],
                'kargroh': kargroh
            },
            success: function (res) {

                res = JSON.parse(res);
                if (res.status === "ok") {
                    $("#loggerDiv").append("<p id='members_" + res.id + "'><span>" + $("#options_" + userId[k]).text() + "</span><span class='btn btn-danger deleteBtn' data-val='" + res.id + "'>حذف</span></p>");
                }

            }
        });
    }

    $("#usersList").val("");
    $(".search-choice-close").click();
});

$("#addToVerifierBtn").on('click', function () {

    kargroh = $("#name").val();

    if(kargroh === "-1" || kargroh.length === 0) {
        alert("لطفا ابتدا نام کار گروه مورد نظر خود را وارد نمایید");
        return;
    }

    let userId = $("#usersList").val();

    if(userId == null || userId.length === 0) {
        alert("لطفا عضو مورد نظر خود را انتخاب نمایید");
        return;
    }

    for(let k = 0; k < userId.length; k++) {
        $.ajax({
            type: 'post',
            url: '/addToKargroh',
            data: {
                'logger': 'off',
                'user_id': userId[k],
                'kargroh': kargroh
            },
            success: function (res) {

                res = JSON.parse(res);
                if (res.status === "ok") {
                    $("#verifierDiv").append("<p id='members_" + res.id + "'><span>" + $("#options_" + userId[k]).text() + "</span><span class='btn btn-danger deleteBtn' data-val='" + res.id + "'>حذف</span></p>");
                }

            }
        });
    }

    $("#usersList").val("");
    $(".search-choice-close").click();
});

$(document).on('click', '.deleteBtn', function () {

    let id = $(this).attr('data-val');

    $.ajax({
        type: 'post',
        url: '/deleteMemberFromKargroh',
        data: {
            'id': id
        },
        success: function (res) {

            res = JSON.parse(res);

            if(res === "ok")
                $("#members_" + id).remove();
        }
    });

});