
let blockId, instId;

$(document).ready(function () {
    blockId = parseInt($("#blockId").attr('data-val'));
    instId = $("#instId").attr('data-val');

    $("#confirmBtn").click(function () {

        $.ajax({
            type: 'post',
            url: '/updateBlock',
            data: {
                'name': $("#name").val(),
                'initNotice': $("#initNotice").val(),
                'finalNotice': $("#finalNotice").val(),
                'duration': $("#duration").val(),
                'prev': $("#prev").val(),
                'defaultKargroh': $("#defaultKargroh").val(),
                'instruction_id': instId,
                'blockId': blockId
            },
            success: function (res) {

                res = JSON.parse(res);

                if(res.status === "ok") {

                    if(blockId === -1)
                        document.location.href = "/blockCreator/" + instId + "/" + res.blockId;
                    else {
                        $("#errs").empty().append("عملیات مورد نظر با موفقیت انجام پذیرفت");
                    }
                }
                else {
                    $("#errs").empty().append(res.errs);
                }
            }
        });
    });
});


$("#manageAccessBtn").on("click", function () {

    if(blockId === -1) {
        alert("لطفا ابتدا اطلاعات مورد نیاز برای بلوک مورد نظر خود را تکمیل نمایید و سپس دکمه تایید را بزنید");
        return;
    }

    let fields = [];

    $("input[name='fields[]']:checked").each(function () {
        fields.push($(this).val());
    });

    $.ajax({
        type: 'post',
        url: '/accessOfBlock',
        data: {
            'fields': fields,
            'blockId': blockId
        },
        success: function (res) {
            res = JSON.parse(res);
            if(res === "ok")
                alert("عملیات مورد نظر با موفقیت انجام شد");
        }
    });
});

$("#addStateKargroh").on('click', function () {

    if(blockId === -1) {
        alert("لطفا ابتدا اطلاعات مورد نیاز برای بلوک مورد نظر خود را تکمیل نمایید و سپس دکمه تایید را بزنید");
        return;
    }

    let kargroh = $("#selectedKargroh").val();
    let states = $("#selectedStates").val();

    if(states == null || states.length === 0) {
        alert("لطفا استان مورد نظر خود را مشخص نمایید");
        return;
    }

    $.ajax({
        type: 'post',
        url: '/assignStateKargroh',
        data: {
            'kargroh': kargroh,
            'states': states,
            'blockId': blockId
        },
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "ok")
                location.reload();
        }
    });

});

$(".deleteBtn").on("click", function () {

    let id = $(this).attr('data-val');

    $.ajax({
        type: 'post',
        url: '/deleteStateKargroh',
        data: {
            'id': id
        },
        success: function (res) {
            if(res === "ok")
                $("#kargroh_" + id).remove();
        }
    });
});