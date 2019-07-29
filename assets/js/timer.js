
let total_time = -1;
let c_minutes = -1;
let c_seconds = -1;
let timer;

$("#resendBtn").on('click', function () {
    resend();
});

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
            'phone_num': phone_num
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
