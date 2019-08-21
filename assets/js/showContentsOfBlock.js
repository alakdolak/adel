
let selectedFormId = -1;

$("document").ready(function () {
    hasPrevRequest();
    hasPreActor();
    requestedMoney();
    others();
    requestModiramelName();
    requesterName();
    requestNamayandeName();
    getPreActorFields();
    getPreConditionsFields();
    getFormData(5, "بازیگر ویژه");
});

function getFormData(formId, label) {

    selectedFormId = formId;

    $.ajax({
        type: 'post',
        url: '/getFormData',
        data: {
            'formId': formId,
            'reqId': $("#reqId").attr('data-val')
        },
        success: function (res) {
            res = JSON.parse(res);
            renderData(label, res);
        }
    });
}

$(document).on('click', '.toggleHistoryBtn', function () {
    toggleComment($(this).attr('data-val'));
});

$(document).on('click', '.toggleRejectBtn', function () {
    toggleReject($(this).attr('data-val'));
});

$(document).on('click', '.acceptBtn', function () {
    acceptField($(this).attr('data-val'));
});

$(document).on('click', '.doReject', function () {
    doReject($(this).attr('data-val'));
});

function doReject(id) {
    $.ajax({
        type: 'post',
        url: '/rejectField',
        data: {
            'formId': selectedFormId,
            'reqId': $("#reqId").attr('data-val'),
            'fieldId': id,
            'errLog': $("#errLog_" + id).val()
        },
        success: function (res) {
            res = JSON.parse(res);
            if(res.status === "ok") {
                $("#status_" + id).empty().append("رد شده");
                toggleReject(id);
            }
        }
    });
}

function acceptField(fieldId) {
    $.ajax({
        type: 'post',
        url: '/acceptField',
        data: {
            'formId': selectedFormId,
            'reqId': $("#reqId").attr('data-val'),
            'fieldId': fieldId
        },
        success: function (res) {
            res = JSON.parse(res);
            if(res.status === "ok") {
                $("#status_" + fieldId).empty().append("تایید شده");
            }
        }
    });
}

function renderFile(field) {

    let newElement = "<div class='row user-profile-post'>";
    newElement += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>";
    newElement += "<div class='profile-user-post-content'>";
    newElement += "<p><span>" + field.label + "</span>";
    newElement += "<span>&nbsp;&nbsp;&nbsp;</span><span>وضعیت تایید</span><span>:&nbsp;</span><span id='status_" + field.id + "'>" + ((field.status == 1) ? "تایید شده" : (field.status == -1) ? "رد شده" : "تایید نشده")+ "</span></p>";
    newElement += "<div class='user-post-reply'>";

    if(field.ext === "jpg" || field.ext === "png" || field.ext === "jpeg" || field.ext === "bmp" ||
        field.ext === "ico" || field.ext === "gif")
        newElement += "<img class='img profile-user-post-img' src='" + field.ans + "' alt=''>";
    else
        newElement += '<a href="' + field.ans + '">دانلود فایل</a>';

    newElement += "<div class='btn-group col-sm-8 col-xs-12' style='float: left; margin-top: 5px; padding: 0'>";
    newElement += "<button data-val='" + field.id + "' class='toggleHistoryBtn btn btn-warning'> سابقه</button>";
    newElement += "<button class='btn btn-basic'> ارجاع</button>";
    newElement += "<button data-val='" + field.id + "' class='toggleRejectBtn btn btn-danger'> اعلان نقص</button>";

    if(field.status != 1)
        newElement += "<button data-val='" + field.id + "' class='acceptBtn btn btn-success'> تایید</button>";

    newElement += "</div>";

    newElement += "</div>";
    newElement += "</div>";
    newElement += "</div>";
    newElement += "</div>";

    newElement += "</div>";

    newElement += "<div data-val='" + field.id + "' class='row hidden user-profile-comment-list user-profile-comment-list_" + field.id + "'>";

    newElement += "<div class='row'>";
    newElement += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>";
    newElement += "<div data-val='" + field.id + "' class='user-profile-comment-content user-profile-comment-content_" + field.id + " hidden'>";

    for(let j = 0; j < field.history.length; j++) {
        newElement += "<p>";
        newElement += "<strong>";
        newElement += field.history[j].text;
        newElement += "</strong>";
        newElement += "</p>";

        newElement += "<div class='row'>";
        newElement += "<div class='col-lg-7'>";
        newElement += "<div class='comment-date-profile'>";
        newElement += "<span class='profile-time-ds-none'>" + field.history[j].date + "</span>";
        newElement += "</div>";
        newElement += "</div>";
        newElement += "</div>";
    }

    newElement += "</div>";

    newElement += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>";
    newElement += "<div data-val='" + field.id + "' class='hidden user-profile-comment-input user-profile-comment-input_" + field.id + "'>";
    newElement += "<textarea id='errLog_" + field.id + "' cols='30' rows='10' placeholder='Write Comment..'></textarea>";
    newElement += "<input style='margin: 10px' data-val='" + field.id + "' type='submit' class='doReject btn btn-warning' value='تایید و ارسال'>";
    newElement += "</div>";
    newElement += "</div>";

    newElement += "</div>";
    newElement += "</div>";
    newElement += "</div>";

    return newElement;
}

function renderData(label, fields) {

    let newElement = "";
    
    newElement += "<div class='row user-profile-post'>";

    newElement += "<div class='row'>";

    newElement += "<div class='col-lg-6 col-md-6 col-sm-6 col-xs-6' style='float: right'>";
    newElement += "<div class='user-profile-post-name'>";
    newElement += "<h2>" + label + "</h2>";
    newElement += "</div>";
    newElement += "</div>";

    newElement += "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-6'>";
    newElement += "<button class='btn btn-success' data-toggle='collapse'  data-target='#adminpro-demo2' style='float: left'> تأیید همه";
    newElement += "</button>";
    newElement += "</div>";

    newElement += "</div>";

    for(let i = 0; i < fields.length; i++) {

        if(fields[i].file) {
            newElement += renderFile(fields[i]);
            continue;
        }
            
        newElement += "<div class='row user-profile-post'>";
        newElement += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>";
        newElement += "<div class='profile-user-post-content'>";
        newElement += "<p><span>" + fields[i].label + "</span>";
        newElement += "<span>&nbsp;&nbsp;&nbsp;</span><span>وضعیت تایید</span><span>:&nbsp;</span><span id='status_" + fields[i].id + "'>" + ((fields[i].status == 1) ? "تایید شده" : (fields[i].status == -1) ? "رد شده" : "تایید نشده")+ "</span></p>";
        newElement += "<div class='user-post-reply'>";
        newElement += "<input class='form-control col-sm-6 col-xs-12' value='" + fields[i].ans + "' disabled type='text'>";

        newElement += "<div class='btn-group col-sm-8 col-xs-12' style='float: left; margin-top: 5px; padding: 0'>";
        newElement += "<button data-val='" + fields[i].id + "' class='toggleHistoryBtn btn btn-warning'> سابقه</button>";
        newElement += "<button class='btn btn-basic'> ارجاع</button>";
        newElement += "<button data-val='" + fields[i].id + "' class='toggleRejectBtn btn btn-danger'> اعلان نقص</button>";

        if(fields[i].status != 1)
            newElement += "<button data-val='" + fields[i].id + "' class='acceptBtn btn btn-success'> تایید</button>";

        newElement += "</div>";

        newElement += "</div>";
        newElement += "</div>";
        newElement += "</div>";
        newElement += "</div>";

        newElement += "</div>";

        newElement += "<div data-val='" + fields[i].id + "' class='row hidden user-profile-comment-list user-profile-comment-list_" + fields[i].id + "'>";

        newElement += "<div class='row'>";
        newElement += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>";
        newElement += "<div data-val='" + fields[i].id + "' class='user-profile-comment-content user-profile-comment-content_" + fields[i].id + " hidden'>";

        for(let j = 0; j < fields[i].history.length; j++) {
            newElement += "<p>";
            newElement += "<strong>";
            newElement += fields[i].history[j].text;
            newElement += "</strong>";
            newElement += "<span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>";
            newElement += "<span class='profile-time-ds-none'> " + fields[i].history[j].date + "</span>";
            newElement += "</p>";

            // newElement += "<div class='row'>";
            // newElement += "<div class='col-lg-7'>";
            // newElement += "<div class='comment-date-profile'>";
            //
            // newElement += "</div>";
            // newElement += "</div>";
            // newElement += "</div>";
        }

        newElement += "</div>";

        newElement += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>";
        newElement += "<div data-val='" + fields[i].id + "' class='hidden user-profile-comment-input user-profile-comment-input_" + fields[i].id + "'>";
        newElement += "<textarea id='errLog_" + fields[i].id + "' cols='30' rows='10' placeholder='Write Comment..'></textarea>";
        newElement += "<input style='margin: 10px' data-val='" + fields[i].id + "' type='submit' class='doReject btn btn-warning' value='تایید و ارسال'>";
        newElement += "</div>";
        newElement += "</div>";

        newElement += "</div>";
        newElement += "</div>";
        newElement += "</div>";
    }

    newElement += "</div>";

    $("#data").empty().append(newElement);
}

function toggleReject(id) {

    let elem = $(".user-profile-comment-list_" + id);

    $(".user-profile-comment-content").each(function(){
        if(!$(this).hasClass('hidden')) {
            $(this).addClass('hidden');
            if(!$('.user-profile-comment-list_' + $(this).attr('data-val')).hasClass('hidden'))
                $('.user-profile-comment-list_' + $(this).attr('data-val')).addClass('hidden');
        }
    });

    $(".user-profile-comment-list").each(function(){
        if($(this).attr('data-val') !== id && !$(this).hasClass('hidden'))
            $(this).addClass('hidden');
    });

    $(".user-profile-comment-input").each(function(){
        if($(this).attr('data-val') !== id && !$(this).hasClass('hidden'))
            $(this).addClass('hidden')
    });

    if(elem.hasClass('hidden')) {
        elem.removeClass('hidden');
        $(".user-profile-comment-input_" + id).removeClass('hidden');
    }
    else {
        elem.addClass('hidden');
        $(".user-profile-comment-input_" + id).addClass('hidden');
    }
}

function toggleComment(id) {

    let elem = $(".user-profile-comment-list_" + id);

    $(".user-profile-comment-content").each(function(){
        if($(this).attr('data-val') !== id && !$(this).hasClass('hidden'))
            $(this).addClass('hidden');
    });

    $(".user-profile-comment-list").each(function(){
        if($(this).attr('data-val') !== id && !$(this).hasClass('hidden'))
            $(this).addClass('hidden');
    });

    $(".user-profile-comment-input").each(function(){
        if(!$(this).hasClass('hidden')) {
            $(this).addClass('hidden');
            if(!$('.user-profile-comment-list_' + $(this).attr('data-val')).hasClass('hidden'))
                $('.user-profile-comment-list_' + $(this).attr('data-val')).addClass('hidden');
        }
    });

    if(elem.hasClass('hidden')) {
        elem.removeClass('hidden');
        $(".user-profile-comment-content_" + id).removeClass('hidden');
    }
    else {
        elem.addClass('hidden');
        $(".user-profile-comment-content_" + id).addClass('hidden');
    }
}

function getPreConditionsFields() {

    $.ajax({
        type: 'post',
        url: '/getPreConditionsField',
        data: {
            'userId': $("#userId").attr('data-val'),
            'instId': $("#instId").attr('data-val'),
        },
        success: function (res) {
            res = JSON.parse(res);

            let newElement = "";

            for(let i = 0; i < res.length; i++) {
                newElement += "<div style='margin: 4px; border-bottom: 1px dashed'>";
                newElement += "<p>";
                newElement += "<span>" + res[i].label + "</span>";
                newElement += "<span>&nbsp;:&nbsp;</span>";
                newElement += "<span>" + res[i].ans + "</span>";
                newElement +="</p>";
                newElement += "</div>";
            }

            $("#preConditions").append(newElement);
        }
    });
}

function getPreActorFields() {

    $.ajax({
        type: 'post',
        url: '/getPreActorFields',
        data: {
            'userId': $("#userId").attr('data-val'),
            'instId': $("#instId").attr('data-val'),
        },
        success: function (res) {
            res = JSON.parse(res);

            let newElement = "";

            for(let i = 0; i < res.length; i++) {
                newElement += "<div style='margin: 4px; border-bottom: 1px dashed'>";
                newElement += "<p>";
                newElement += "<span>" + res[i].label + "</span>";
                newElement += "<span>&nbsp;:&nbsp;</span>";
                newElement += "<span>" + res[i].ans + "</span>";
                newElement +="</p>";
                newElement += "</div>";
            }

            $("#preActor").append(newElement);
        }
    });
}

function requestModiramelName() {

    $.ajax({
        type: 'post',
        url: '/requestModiramelName',
        data: {
            'reqId': $("#reqId").attr('data-val')
        },
        success: function (res) {
            res = JSON.parse(res);
            $("#modirAmelName").append(res.result);
        }
    });
}

function requesterName() {

    $.ajax({
        type: 'post',
        url: '/requesterName',
        data: {
            'reqId': $("#reqId").attr('data-val'),
            'haghighi': $("#haghighi").attr('data-val')
        },
        success: function (res) {
            res = JSON.parse(res);
            $("#requesterName").append(res.result);
        }
    })
}

function requestNamayandeName() {
    $.ajax({
        type: 'post',
        url: '/requestNamayandeName',
        data: {
            'reqId': $("#reqId").attr('data-val')
        },
        success: function (res) {
            res = JSON.parse(res);
            $("#namayandeName").append(res.result);
        }
    });
}

function others() {

    let haghighi = $("#haghighi").attr('data-val');

    $.ajax({
        type: 'post',
        url: '/others',
        data: {
            'reqId': $("#reqId").attr('data-val'),
            'haghighi': haghighi
        },
        success: function (res) {

            res = JSON.parse(res);
            let newElement = "";

            if(haghighi == 0) {
                for (let i = 0; i < res.length; i++) {
                    newElement += "<div style='padding: 4px; border-bottom: 1px dashed'>";
                    newElement += "<p>";
                    newElement += "<span>" + res[i].first_name + " " + res[i].last_name + " - " + res[i].role + "</span>";
                    newElement += "</p>";
                    newElement += "<p>";
                    newElement += "<span>کد ملی: " + res[i].nid + "</span>";
                    newElement += "</p>";
                    newElement += "<p>";
                    newElement += "<span>درصد سهام: " + res[i].percent + "</span>";
                    newElement += "</p>";
                    newElement += "</div>";
                }
            }

            $("#others").append(newElement);
        }
    });
}

function hasPrevRequest() {
    $.ajax({
        type: 'post',
        url: '/hasPrevRequest',
        data: {
            'userId': $("#userId").attr('data-val')
        },
        success: function (res) {
            res = JSON.parse(res);
            if(res.status)
                $(".hasPrevReq").append("دارد");
            else
                $(".hasPrevReq").append("ندارد");
        }
    });
}

function requestedMoney() {
    $.ajax({
        type: 'post',
        url: '/requestedMoney',
        data: {
            'userId': $("#userId").attr('data-val'),
            'instId': $("#instId").attr('data-val'),
        },
        success: function (res) {
            res = JSON.parse(res);
            $("#requestedMoney").append(res.requestedMoney);
            $("#requestedMoneyRelation").append(res.max);
        }
    });
}

function hasPreActor() {
    $.ajax({
        type: 'post',
        url: '/hasPreActor',
        data: {
            'userId': $("#userId").attr('data-val'),
            'instId': $("#instId").attr('data-val'),
        },
        success: function (res) {
            res = JSON.parse(res);
            if(res.status)
                $(".hasPreAct").append("دارد");
            else
                $(".hasPreAct").append("ندارد");
        }
    });
}