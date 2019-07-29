
$("#continueStages1").on("click", function () {
    submitFirstForm();
});

$("#continueStages2").on("click", function () {
    submitSecondForm();
});

$("#continueStages3").on("click", function () {
    submitThirdForm();
});

function submitFirstForm() {

    let nid = $("#idC").val();
    phone_num = $("#pNum").val();

    if(nid.length === 0 || phone_num.length === 0) {
        $(".formErr").addClass('hidden');
        $("#fillInfo").removeClass('hidden');
        return;
    }

    if($("#accCheck").prop('checked')) {

        $.ajax({

            url: '/signup',
            type: 'post',
            data: {
                'nid': nid,
                'phone_num': phone_num
            },
            success: function (res) {

                res = JSON.parse(res);

                if(res.status === "ok") {
                    $("#gam1").addClass('hidden');
                    $("#gam2").removeClass('hidden');
                    startTimer(300);
                }
                else if(res.status === "nok1") {
                    $(".formErr").addClass('hidden');
                    $("#incorrectNID").removeClass('hidden');
                }
                else if(res.status === "nok2") {
                    $(".formErr").addClass('hidden');
                    $("#duplicateNID").removeClass('hidden');
                }
                else if(res.status === "nok3") {
                    $(".formErr").addClass('hidden');
                    $("#tooManyRequest").removeClass('hidden');
                }
            }
        });
    }
    else {
        $(".formErr").addClass('hidden');
        $("#agreement").removeClass('hidden');
        $("#accCheck").css('width', '20px').css('height', '20px');
    }
}

function submitSecondForm() {

    let code = $("#vCode").val();

    $.ajax({

        url: '/activeProfile',
        type: 'post',
        data: {
            'code': code,
            'phone_num': phone_num
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
            'phone_num': phone_num,
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
