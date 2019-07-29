
let phone_num;
let act_code = -1;

$("#submitCodeBtn").on('click', function () {
    submitCode();
});

$("#changePassBtn").on('click', function () {
    changePass();
});

$("#signInBtn").on('click', function () {
    submitNID();
});

function submitNID() {

    let nid = $("#nid").val();
    if(nid.length === 0)
        return;

    $.ajax({

        type: 'post',
        url: '/forget',
        data: {
            'nid': nid
        },
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "ok") {
                $("#pass1").addClass('hidden');
                $("#pass2").removeClass('hidden');
                phone_num = res.phone_num;
                startTimer(300);
            }
            else {
                $(".warning").addClass('hidden');
                $("#invalidNID").removeClass('hidden');
            }

        }
    });
}

function submitCode() {

    let code = $("#code").val();
    if(code.length === 0)
        return;

    $.ajax({

        type: 'post',
        url: '/submitForgetCode',
        data: {
            'code': code,
            'phone_num': phone_num
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
            'phone_num': phone_num,
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
