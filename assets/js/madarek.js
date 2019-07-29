
let done = [];
let instId;
let nextURL;

$(document).ready(function () {
    instId = $("#instId").attr('data-val');
    nextURL = $("#nextURL").attr('data-val');
});

$(document).on("click", "#confirm", function () {
    nextPage();
});

function hasNonAnswered() {

    for(let i = 0; i < done.length; i++) {
        if(done[i] === 0)
            return true;
    }

    return false;
}

function submitForm() {

    $('#upload').removeClass('hidden');

    $.each($('input'), function() {

        let mode = $(this).attr('name');
        let label = $(this).attr('data-label');

        if($(this).attr('type') === "file") {
            $.each($(this)[0].files, function (i, file) {

                let newElement = "";
                let formData = new FormData();
                done[mode] = 0;
                formData.append('file-' + i, file);
                newElement += "<p><span>" + label + "</span><span>&nbsp;&nbsp;&nbsp;</span><span id='status_" + mode + "' class='blueStatus'>در حال ارسال</span></p>";
                $("#files").append(newElement);

                $.ajax({
                    url: '/submitInfoMadrak/' + instId + "/" + mode,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    method: 'POST',
                    success: function (response) {
                        response = JSON.parse(response);
                        if (response.status === "nok") {
                            $("#status_" + response.mode).empty().append(response.error).removeClass('blueStatus').addClass('redStatus');
                            done[response.mode] = -1;
                        }
                        else if (response.status === "ok") {
                            done[response.mode] = 1;
                            $("#status_" + response.mode).empty().append('انجام شد').removeClass('blueStatus').addClass('greenStatus');
                        }
                    }
                });
            });
        }
        else {
            done[mode] = 0;
            let newElement = "<p><span>" + label + "</span><span>&nbsp;&nbsp;&nbsp;</span><span id='status_" + mode + "' class='blueStatus'>در حال ارسال</span></p>";
            $("#files").append(newElement);
            $.ajax({
                url: '/submitInfoMadrak2/' + instId + "/" + mode,
                data: {
                    'val': $(this).val()
                },
                method: 'POST',
                success: function (response) {
                    response = JSON.parse(response);
                    if (response.status === "nok") {
                        $("#status_" + response.mode).empty().append(response.error).removeClass('blueStatus').addClass('redStatus');
                        done[response.mode] = -1;
                    }
                    else if (response.status === "ok") {
                        done[response.mode] = 1;
                        $("#status_" + response.mode).empty().append('انجام شد').removeClass('blueStatus').addClass('greenStatus');
                    }
                }
            });
        }

        // while (hasNonAnswered);
        $("#confirm").removeClass('hidden');
    });
}

function nextPage() {
    document.location.href = nextURL;
}

function closePopUp() {
    $("#upload").addClass('hidden');
}