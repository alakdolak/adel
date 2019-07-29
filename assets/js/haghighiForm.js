function submitForm() {

    $.ajax({
        type: 'post',
        url: "/submitHaghighiForm",
        data: {
            "instId": $("input[name='instId']").val(),
            "first_name": $("input[name='first_name']").val(),
            "last_name": $("input[name='last_name']").val(),
            "nid": $("input[name='nid']").val(),
            "email": $("input[name='email']").val(),
            "phone": $("input[name='phone']").val(),
            "city_id": $("select[name='city_id']").val(),
            "address": $("textarea[name='address']").val()
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