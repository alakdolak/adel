let selectedState = -1;
let completeAnsFile;
let hasError;
let data;
let instId;
let specialCities;
let final;
let mode;

$(document).ready(function () {
    specialCities = $("#specialCities").attr('data-val');
    final = $("#final").attr('data-val');
    mode = $("#mode").attr('data-val');
    if(mode === undefined)
        mode = "0";

    let tmp = $(".form_input_state");
    if(tmp !== undefined && tmp.length > 0) {
        tmp = $("#selectedState");
        if(tmp !== undefined && tmp.length > 0) {
            selectedState = parseInt(tmp.attr('data-val'));
            selectedCity = parseInt($("#selectedCity").attr('data-val'));
        }

        getStates();
    }

    $(function () {
        $(".justFarsi").farsiInput();
    });
});

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

    let url = (final === "true") ? "/submitPostUserData" : "/submitPreUserData";

    $.ajax({
        type: 'post',
        url: url,
        data: data,
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "nok") {
                let newElement = "";
                for (let i = 0; i < res.errs.length; i++)
                    newElement += res.errs[i] + "<br/>";

                $("#errors").append(newElement);
            }
            else if(!hasError){
                if(final === "false" && instId != "4") {
                    if (mode === "1")
                        document.location.href = '/farayand/1/1/' + $("input[name='instId']").val();
                    else
                        document.location.href = '/prefarayand/' + $("input[name='instId']").val();
                }
                else {
                    finalize();
                }

            }
        }
    });
}

function submitForm() {

    completeAnsFile = [];
    hasError = false;

    let elem;
    data = {};

    instId =  $("input[name='instId']").val();

    data["instId"] = instId;

    if(final === "false")
        data["mode"] = mode;

    $("#errors").empty();

    $(".form_input").each(function () {

        elem = $(this);
        let attrId = elem.attr('data-val');
        let type = parseInt(elem.attr('data-type'));
        
        if(type === 6  || type === 8 || type === 9 || type === 7 || type === 3 || type === 4) {
            if (elem.val() !== undefined)
                data[attrId] = elem.val();
        }
        else {
            if (elem.val !== undefined) {
                if (type === 1)
                    data[attrId] = elem.prop('checked');
                else if (type === 2)
                    data[attrId] = $("select[name='year_" + attrId + "']").val() + "/" +
                        $("select[name='month_" + attrId + "']").val() + "/" +
                        $("select[name='day_" + attrId + "']").val();

                else if (type === 5) {

                    if(elem[0].files.length > 0) {

                        completeAnsFile[attrId] = false;

                        let formData = new FormData();

                        $.each(elem[0].files, function(i, file) {
                            formData.append('file-'+i, file);
                        });

                        $.ajax({
                            url: '/upload_user_file_pre_post/' + instId + "/" + ((final === "true") ? "post" : (mode === "1") ? "preCond" : "preActor") + "/" + attrId,
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

    });

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
            changeStateHandler();
        }
    });
}

$(document).on('change', ".stateHandler", function () {
    changeStateHandler($(this).val());
});

function changeStateHandler() {

    if(specialCities == "1")
        changeState2($("#state").val());
    else {
        changeState($("#state").val());
    }
}