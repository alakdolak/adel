
$(document).ready(function () {

    $(".justNumber").on('keypress', function () {
        return isNumber(event);
    }).on('paste', function () {
        return isNumber(event);
    });

    $(".justEnglish").on('keypress', function () {
        return isEnglish(event);
    }).on('paste', function () {
        return isEnglish(event);
    });

    for(let iii = 0; iii < 60; iii++) {

        $("#onOff" + iii).on('click', function () {
            toggleOnOff(iii);
        });

    }

    $("#confirms1m1").on('click', function () {
        submitForm();
    });

    $(".homeBtn").on('click', function () {
        document.location.href = '/';
    });

    $(".contactUsBtn").on('click', function () {
        document.location.href = '/contactUs';
    });

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

});

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function isEnglish(event) {
    let ew = event.which;
    return 32 <= ew && ew <= 126;
}

function toggleOnOff(idx) {

    const elem = $("#onOff" + idx);
    if(elem.hasClass('on')) {
        elem.removeClass('on');
        elem.addClass('off');
        elem.attr('src', '/assets/img/helpoff.png');
        $("#explain" + idx).removeClass('hidden');
    }
    else {
        elem.removeClass('off');
        elem.addClass('on');
        elem.attr('src', '/assets/img/helpon.png');
        $("#explain" + idx).addClass('hidden');
    }
}


$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});