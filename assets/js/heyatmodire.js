let arr_nums = ["اول", "دوم", "سوم", "چهارم", "پنجم", "ششم", "هفتم", "هشتم", "نهم", "دهم"];
let free_idx = [false, false, false, false, false, false, false, false, false, false];
let instId;

$(document).ready(function () {
    instId = $("#instId").attr('data-val');
    getMembers();
});

$(document).on('click','.delete',function() {
    removeUser($(this).attr('data-val'));
    renewTitles();
});

$(document).on("keypress", ".justNumber", function () {
    return isNumber(event);
}).on('paste', ".justNumber", function () {
    return false;
});


function getMembers() {
    $.ajax({
        type: 'post',
        url: '/getRequestMembers',
        data: {
            'instId': instId
        },
        success: function (res) {
            res = JSON.parse(res);

            if(res.status === "nok") {
                document.location.href = "/";
                return;
            }

            if(res.users.length === 0) {
                render_a_form(0);
                free_idx[0] = true;
            }
            else {
                for (let i = 0; i < res.users.length; i++) {
                    render_a_form(i);
                    free_idx[i] = true;
                    $("input[name='first_name_" + i + "']").val(res.users[i].first_name);
                    $("input[name='last_name_" + i + "']").val(res.users[i].last_name);
                    $("input[name='nid_" + i + "']").val(res.users[i].nid);
                    $("select[name='role_" + i + "']").val(res.users[i].role);
                    $("input[name='percent_" + i + "']").val(res.users[i].percent);
                    $("input[name='id_" + i + "']").val(res.users[i].id);
                }

                $("#numOfMembers").val(res.users.length);
            }
        }
    });
}

$("#numOfMembers").on("change", function () {
    changeNum($(this).val());
});

function changeNum(val) {

    val = parseInt(val);

    let filled = 0;

    for (let i = 0; i < 10; i++) {
        if(free_idx[i])
            filled++;

        if(filled > val) {
            for (let j = i; j < 10; j++) {
                $("#user_" + j).remove();
                free_idx[j] = false;
            }
        }
    }

    if (filled < val) {
        for (let i = 0; i < val - filled; i++) {
            for(let j = 0; j < 10; j++) {
                if(!free_idx[j]) {
                    render_a_form(j);
                    free_idx[j] = true;
                    break;
                }
            }
        }
    }

    renewTitles();
}

function render_a_form(idx) {

    let newElement = "";

    newElement += '<div class="cards" data-val="' + idx + '" id="user_' + idx + '"><div class="inputLabel" style=" background-color: #FFDE9E; margin-top: 30px">';
    newElement += '<div style=" padding: 3px 0 10px 30px; font-size: 15px; width: 100%;">';
    newElement += '<div style=" padding: 3px 0 10px 30px; font-size: 15px; width: 100%;">';
    newElement += "<input type='hidden' name='id_" + idx + "' value='-1'>"
    newElement += '<span id="title_' + idx + '" style=" padding: 3px 0 0 30px; font-size: 15px; width: 100%; color: #aa0800;">عضو ' + arr_nums[idx] + '</span>';
    newElement += '</div>';
    newElement += '<span style=" padding: 3px 0 0 30px; font-size: 15px; width: 100%;">نام و نام خانوادگی</span>';
    newElement += '</div>';
    newElement += '<div style=" width: 100%;">';
    newElement += '<input class="signInInput form-control" id="firstBoardMemberName_' + idx + '" type="text" placeholder="نام" name="first_name_' + idx + '" style="width:25%; display: inline-block; margin: 0 0 0 2%">';
    newElement += '<input class="signInInput form-control" id="firstBoardMemberFamilyName_' + idx + '" type="text" placeholder="نام خانوادگی" name="last_name_' + idx + '" style="width:50%; display: inline-block; margin: 0 3% 0 0">';
    newElement += '<img class="off" id="onOff' + (idx * 4 + 1) + '" src="/assets/img/helpoff.png" style="float: left; width: 30px">';
    newElement += '<p class="explainText" id="explain' + (idx * 4 + 1) + '"> نام و نام خانوادگی خود را بر اساس کارت ملی و یا شناسنامه درج نمایید</p>';
    newElement += '</div></div><div class="inputLabel" style=" background-color: #FFDE9E">';
    newElement += '<div style=" padding: 3px 0 10px 30px; font-size: 15px; width: 100%;">';
    newElement += '<span style=" padding: 3px 0 0 30px; font-size: 15px; width: 100%;">کد ملی</span>';
    newElement += '</div><div style=" width: 100%;">';
    newElement += '<input class="justNumber signInInput form-control" type="text" placeholder="کد ملی ده رقمی" name="nid_' + idx + '" style="width: 80%; display: inline-block">';
    newElement += '<img class="off" id="onOff' + (idx * 4 + 2) + '" src="/assets/img/helpoff.png" style="float: left; width: 30px">';
    newElement += '<p class="explainText" id="explain' + (idx * 4 + 2)  + '">لطفاً پس از وارد کردن نام و نام خانوادگی به همراه کد ملی دکمه سنجش اصالت را فشار دهید. سایر اطلاعات هویتی توسط سامانه شاهکار پر خواهد گردید</p>';
    newElement += '</div></div><div class="inputLabel" style=" background-color: #FFDE9E">';
    newElement += '<div style=" padding: 3px 0 10px 30px; font-size: 15px; width: 100%;">';
    newElement += '<span style=" padding: 3px 0 0 30px; font-size: 15px; width: 100%;">سمت</span>';
    newElement += '</div><div style=" width: 100%;">';
    newElement += '<select class="signInInput form-control" name="role_' + idx + '" style="width:80%; display: inline-block">';
    newElement += '<option value="1">رئیس هیئت مدیره</option>';
    newElement += '<option value="2">مدیر عامل و عضو هیئت مدیره</option>';
    newElement += '<option value="3">عضو هیئت مدیره</option>';
    newElement += '<option value="4">نایب رئیس هیئت مدیره</option>';
    newElement += '<option value="5">سایر</option>';
    newElement += '</select>';
    newElement += '<img class="off" id="onOff' + (idx * 4 + 3) + '" src="/assets/img/helpoff.png" style="float: left; width: 30px">';
    newElement += '<p class="explainText" id="explain' + (idx * 4 + 3)  + '">سمت عضو مورد نظر خود را از میان گزینه های موجود، انتخاب نمایید.</p>';
    newElement += '</div></div>';
    newElement += '<div class="inputLabel" style=" background-color: #FFDE9E">';
    newElement += '<div style=" padding: 3px 0 10px 30px; font-size: 15px; width: 100%;">';
    newElement += '<span style=" padding: 3px 0 0 30px; font-size: 15px; width: 100%;">درصد سهام</span>';
    newElement += '</div><div style=" width: 100%;">';
    newElement += '<input class="justNumber signInInput form-control" type="text" name="percent_' + idx + '" style="width: 80%; display: inline-block">';
    newElement += '<img class="off" id="onOff' + (idx * 4 + 4) + '" src="/assets/img/helpoff.png" style="float: left; width: 30px">';
    newElement += '<p class="explainText" id="explain' + (idx * 4 + 4)  + '">درصد سهام عضو مورد نظر خود را وارد نمایید.</p>';
    newElement += '</div>';
    newElement += '<p data-val="' + idx + '" class="delete" style="float: left; color: #2098D1; cursor: pointer">حذف</p><p id="errors_' + idx + '"></p></div></div>';

    $("#usersDiv").append(newElement);

    $(function () {
        $("#firstBoardMemberName_" + idx +  ", #firstBoardMemberFamilyName_" + idx).farsiInput();
    });

    $("#onOff" + (idx * 4 + 1)).on('click', function () {
        toggleOnOff(idx * 4 + 1);
    });

    $("#onOff" + (idx * 4 + 2)).on('click', function () {
        toggleOnOff(idx * 4 + 2);
    });

    $("#onOff" + (idx * 4 + 3)).on('click', function () {
        toggleOnOff(idx * 4 + 3);
    });

    $("#onOff" + (idx * 4 + 4)).on('click', function () {
        toggleOnOff(idx * 4 + 4);
    });
}

function removeUser(idx) {

    let id_idx = parseInt($("input[name='id_" + idx + "'").val());

    if(id_idx !== -1) {
        $.ajax({
            type: 'post',
            url: '/removeHeyatModireForm',
            data: {
                'id': id_idx
            },
            success: function (res) {

                if(res === "ok") {

                    $("#user_" + idx).remove();
                    free_idx[idx] = false;

                    let counter = 0;
                    for (let i = 0; i < 10; i++) {
                        if (free_idx[i])
                            counter++;
                    }

                    if(counter === 0) {
                        counter = 1;
                        render_a_form(0);
                        free_idx[0] = true;
                    }

                    $("#numOfMembers").val(counter);
                }
                else {
                    $("#errors_" + idx).empty().append('عملیات مورد نظر با خطا مواجه شده است');
                }
            }
        });
    }
    else {
        $("#user_" + idx).remove();
        free_idx[idx] = false;

        let counter = 0;
        for(let i = 0; i < 10; i++) {
            if(free_idx[i])
                counter++;
        }

        if(counter === 0) {
            counter = 1;
            render_a_form(0);
            free_idx[0] = true;
        }

        $("#numOfMembers").val(counter);
    }
}

function renewTitles() {

    let queue = [];
    let counter2 = 0;

    $(".cards").each(function () {
        queue[counter2++] = $(this).attr('data-val');
    });

    let counter = 0;
    for (let i = 0; i < free_idx.length; i++) {
        if(free_idx[i])
            $("#title_" + queue[counter]).text('عضو ' + arr_nums[counter++]);
    }
}

let start;
let hasErr;

function submitForm() {
    start = 0;
    hasErr = false;
    doSubmit();
}

function doSubmit() {

    for (let i = start; i < 10; i++) {

        if(free_idx[i]) {

            $.ajax({
                type: 'post',
                url: '/submitHeyatModireForm',
                data: {
                    "instId": instId,
                    "first_name": $("input[name='first_name_" + i + "']").val(),
                    "last_name": $("input[name='last_name_" + i + "']").val(),
                    "nid": $("input[name='nid_" + i + "']").val(),
                    'role': $("select[name='role_" + i + "']").val(),
                    'percent': $("input[name='percent_" + i + "']").val(),
                    'id': $("input[name='id_" + i + "']").val()
                },
                success: function (res) {

                    res = JSON.parse(res);

                    if(res.status === "nok") {
                        let newElement = "";
                        for (let i = 0; i < res.errs.length; i++)
                            newElement += res.errs[i] + "<br/>";

                        $("#errors_" + i).empty().append(newElement);
                        hasErr = true;
                    }
                    else {
                        start++;
                        doSubmit();
                    }

                }
            });
            return;
        }
    }

    if(!hasErr)
        document.location.href = '/farayand/1/4/' + instId;

}