
$(document).ready(function () {
    $(function () {
        $("#juridicalName").farsiInput();
    });
});

function submitForm() {

    $.ajax({
        type: 'post',
        url: "/submitSenfForm",
        data: {
            "instId": $("input[name='instId']").val(),
            "name": $("input[name='name']").val(),
            "nid": $("input[name='nid']").val(),
            "email": $("input[name='email']").val(),
            "phone": $("input[name='phone']").val(),
            "city_id": $("select[name='city_id']").val(),
            "address": $("textarea[name='address']").val(),
            "pre_tel": $("input[name='pre_tel']").val(),
            "pre_namabar": $("input[name='pre_namabar']").val(),
            "economy_code": $("input[name='economy_code']").val(),
            "post_code": $("input[name='post_code']").val(),
            "tel": $("input[name='tel']").val(),
            "namabar": $("input[name='namabar']").val(),
            "site": $("input[name='site']").val()
        },
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "nok") {
                let newElement = "";
                for (let i = 0; i < res.errs.length; i++)
                    newElement += res.errs[i] + "<br/>";

                $("#errors").empty().append(newElement);
            }
            else {
                document.location.href = res.url;
            }

        }
    });
}