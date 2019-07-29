
function submitForm() {

    $.ajax({
        type: 'post',
        url: '/submitHoghoghiForm',
        data: {
            "instId": $("input[name='instId']").val(),
            "name": $("input[name='name']").val(),
            "company_kind": $("select[name='company_kind']").val(),
            "company_no": $("input[name='company_no']").val(),
            "submit_date_day": $("select[name='submit_date_day']").val(),
            "submit_date_month": $("select[name='submit_date_month']").val(),
            "submit_date_year": $("select[name='submit_date_year']").val(),
            "nid": $("input[name='nid']").val(),
            "pre_tel": $("input[name='pre_tel']").val(),
            "pre_namabar": $("input[name='pre_namabar']").val(),
            "economy_code": $("input[name='economy_code']").val(),
            "city_id": $("select[name='city_id']").val(),
            "address": $("textarea[name='address']").val(),
            "post_code": $("input[name='post_code']").val(),
            "tel": $("input[name='tel']").val(),
            "namabar": $("input[name='namabar']").val(),
            "email": $("input[name='email']").val(),
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

$(document).on('click', function () {
    $(function () {
        $("#juridicalName").farsiInput();
    });
});