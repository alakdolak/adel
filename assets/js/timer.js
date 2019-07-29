
let total_time = -1;
let c_minutes = -1;
let c_seconds = -1;
let timer;

let act_code = -1;
let reminder;
let userId = -1;

$(document).ready(function () {

    userId = $("#userId").attr('data-val');
    reminder = parseInt($("#reminder").attr('data-val'));

    startTimer(reminder);

    $("#resendBtn").on('click', function () {
        resend();
    });

    $("#continueStages2").on("click", function () {
        submitSecondForm();
    });

    $("#continueStages3").on("click", function () {
        submitThirdForm();
    });

    $("#submitCodeBtn").on('click', function () {
        submitCode();
    });

    $("#changePassBtn").on('click', function () {
        changePass();
    });

});

function submitCode() {

    let code = $("#code").val();
    if(code.length === 0)
        return;

    $.ajax({

        type: 'post',
        url: '/submitForgetCode',
        data: {
            'code': code,
            'userId': userId
        },
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "ok") {
                $("#pass2").addClass('hidden');
                $("#pass3").removeClass('hidden');
                act_code = code;
            }
            else {
                $(".warning").addClass('hidden');
                $("#invalidCode").removeClass('hidden');
            }

        }
    });

}

function changePass() {

    let confirm_pass = $("#conf").val();
    let pass = $("#suPass").val();

    if(pass.length === 0)
        return;

    $.ajax({

        url: '/changePass',
        type: 'post',
        data: {
            'password': pass,
            'userId': userId,
            'confirm_password': confirm_pass,
            'code': act_code
        },
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "ok") {
                document.location.href = "/";
            }
            else if(res.status === "nok1") {
                $('.formErr').addClass('hidden');
                $("#incorrectPass").removeClass('hidden');
            }
            else if(res.status === "nok2") {
                $('.formErr').addClass('hidden');
                $("#invalidPass").removeClass('hidden');
            }
        }
    });
}

function submitSecondForm() {

    let code = $("#vCode").val();

    $.ajax({

        url: '/activeProfile',
        type: 'post',
        data: {
            'code': code,
            'userId': userId
        },
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "ok") {
                $("#gam2").addClass('hidden');
                $("#gam3").removeClass('hidden');
            }
            else if(res.status === "nok") {
                $(".formErr").addClass('hidden');
                $("#codeErr").removeClass('hidden');
            }
        }
    });
}

function submitThirdForm() {

    let confirm_pass = $("#conf").val();
    let pass = $("#suPass").val();
    let email = $("#suEmail").val();
    let ques = $("#suSecureQues").val();

    if(email.length === 0)
        email = -1;

    $.ajax({

        url: '/choosePass',
        type: 'post',
        data: {
            'password': pass,
            'userId': userId,
            'confirm_password': confirm_pass,
            'email': email,
            'ques': ques
        },
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "ok") {
                document.location.href = "/";
            }
            else if(res.status === "nok1") {
                $('.formErr').addClass('hidden');
                $("#incorrectPass").removeClass('hidden');
            }
            else if(res.status === "nok2") {
                $('.formErr').addClass('hidden');
                $("#invalidPass").removeClass('hidden');
            }
            else if(res.status === "nok3") {
                $('.formErr').addClass('hidden');
                $("#allFields").removeClass('hidden');
            }
        }
    });
}

function startTimer(t) {

    $("#resendDiv").addClass('hidden');
    total_time = t;
    c_minutes = parseInt(total_time / 60);
    c_seconds = parseInt(total_time % 60);
    clearTimeout(timer);

    if (total_time > 0)
        timer = setTimeout("checkTime()", 1);
    else
        showResendBtn();
}

function checkTime() {
    document.getElementById("reminder_time").innerHTML =  c_seconds + " : " + c_minutes;
    if (total_time <= 0)
        timer = setTimeout("showResendBtn()", 1);
    else {
        total_time--;
        c_minutes = parseInt(total_time / 60);
        c_seconds = parseInt(total_time % 60);
        timer = setTimeout("checkTime()", 1000);
    }
}

function resend() {

    $.ajax({

        url: '/resendActivation',
        type: 'post',
        data: {
            'userId': userId
        },
        success: function (res) {

            res = JSON.parse(res);

            if (res.status === "ok") {
                startTimer(300);
            }
            else {

                clearTimeout(timer);

                total_time = res.reminder;
                c_minutes = parseInt(total_time / 60);
                c_seconds = parseInt(total_time % 60);

                if (total_time > 0)
                    timer = setTimeout("checkTime()", 1);
                else
                    showResendBtn();
            }
        }
    });
}

function showResendBtn() {

    if($("#resendDiv").hasClass('hidden')) {
        $("#resendDiv").removeClass('hidden');
    }
}
