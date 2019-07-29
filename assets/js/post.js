
let completeAnsFile;
let hasError;
let data;

function checkFilesCompleteness() {

    let sendOther = true;

    for(let k = 0; k < completeAnsFile.length; k++) {
        if(completeAnsFile[k] === false) {
            setTimeout(checkFilesCompleteness, 500);
            sendOther = false;
            break;
        }
    }

    if(sendOther && !hasError) {
        sendOtherForm();
    }

}

function sendOtherForm() {

    $.ajax({
        type: 'post',
        url: "/submitPostUserData",
        data: data,
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "nok") {
                let newElement = "";
                for (let i = 0; i < res.errs.length; i++)
                    newElement += res.errs[i] + "<br/>";

                $("#errors").empty().append(newElement);
            }

            else if(!hasError){
                $("#errors").append("ارسال اطلاعات با موفقیت انجام شد. به مرحله بعد بروید");
            }

        }
    });
}

function submitForm() {

    let elem;
    data = {};
    completeAnsFile = [];
    hasError = false;

    let instId =  $("input[name='instId']").val();
    data["instId"] = instId;

    for(let i = 0; i < indices.length; i++) {

        if(types[i] === 6 || types[i] === 8 || types[i] === 9) {
            elem = $("select[name='" + indices[i] + "']");
            if (elem.val !== undefined) {
                data[indices[i]] = elem.val();
            }
        }

        else if(types[i] === 7) {
            elem = $("textarea[name='" + indices[i] + "']");
            data[indices[i]] = elem.val();
        }

        else {
            elem = $("input[name='" + indices[i] + "']");
            if (elem.val !== undefined) {
                if (types[i] === 1)
                    data[indices[i]] = elem.prop('checked');
                else if (types[i] === 2)
                    data[indices[i]] = $("select[name='year_" + indices[i] + "']").val() + "/" +
                        $("select[name='month_" + indices[i] + "']").val() + "/" +
                        $("select[name='day_" + indices[i] + "']").val();
                else if (types[i] === 3 || types[i] === 4)
                    data[indices[i]] = elem.val();
                else if (types[i] === 5) {

                    if(elem[0].files.length > 0) {

                        completeAnsFile[indices[i]] = false;
                        let formData = new FormData();

                        $.each(elem[0].files, function(i, file) {
                            formData.append('file-'+i, file);
                        });

                        $.ajax({
                            url: '/upload_user_file_pre_post/' + instId + "/post/" + indices[i],
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false,
                            method: 'POST',
                            success: function (response) {

                                response = JSON.parse(response);
                                completeAnsFile[response.attrId] = true;

                                if(response.status === "nok") {
                                    $("#errors").append(response.error);
                                    hasError = true;
                                }
                            }
                        });
                    }
                }
            }
        }
    }

    checkFilesCompleteness();
}

function getStates() {

    $.ajax({
        type: 'post',
        url: '/getStates',
        success: function (res) {

            res = JSON.parse(res);

            let newElement = "<option value='-1'>استان</option>";

            if(res.length > 0) {

                for(let i = 0; i < res.length; i++) {
                    if(selectedState === res[i].id)
                        newElement += "<option selected value='" + res[i].id + "'>" + res[i].name + "</option>";
                    else
                        newElement += "<option value='" + res[i].id + "'>" + res[i].name + "</option>";
                }
            }

            $("#state").empty().append(newElement);
            changeState($("#state").val());
        }
    });
}