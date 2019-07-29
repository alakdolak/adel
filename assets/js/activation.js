
$("#continueStages1").on("click", function () {
    submitFirstForm();
});

let captchaResponse = "";

function submitFirstForm() {

    let nid = $("#idC").val();
    phone_num = $("#pNum").val();

    if(nid.length === 0 || phone_num.length === 0) {
        $(".formErr").addClass('hidden');
        $("#fillInfo").removeClass('hidden');
        return;
    }

    if($("#accCheck").prop('checked')) {

        captchaResponse = $("#g-recaptcha-response").val();

        if(captchaResponse === "") {
            $(".formErr").addClass('hidden');
            $("#incorrectCaptcha").removeClass('hidden');
            return;
        }

        $("#firstForm").submit();
    }
    else {
        $(".formErr").addClass('hidden');
        $("#agreement").removeClass('hidden');
        $("#accCheck").css('width', '20px').css('height', '20px');
    }
}