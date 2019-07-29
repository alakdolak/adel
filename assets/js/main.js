$(".newsBtn").on('click', function () {
    document.location.href = '/news';
});

$(".complaintBtn").on('click', function () {
    document.location.href = '/complaint';
});

$(".loginBtn").on('click', function () {
    document.location.href = '/login';
});

$(".toggleProfile").on('click', function () {
    toggleProfileMenu();
});

$("#closeNewsPopUp").on('click', function () {
    closeNewsPopUp()
});

$("#navbarBtnResponsive").on('click', function () {
    if($('#hamberMenu').hasClass('hidden'))
        $('#hamberMenu').removeClass('hidden');
    else
        $('#hamberMenu').addClass('hidden')
});

$(".disabilityImg").on('click', function () {
    showBlindness();
});

$(".upBtn").on('click', function () {
    scrollUp();
});

$(".rightBtn").on('click', function () {
    scrollRight();
});

$(".downBtn").on('click', function () {
    scrollDown();
});

$(".leftBtn").on('click', function () {
    myScrollLeft();
});

$("#ceil").on('click', function () {
    changeNeededCeil('ceil');
});

$("#compare").on('click', function () {
    changeNeededCeil('compare');
});

let height;

function increaseBoxTextHeight(idx) {

    height += 10;
    $("#textBox" + idx).css('height', height + "px");

    if(height < 200) {
        setTimeout(function () {
            increaseBoxTextHeight(idx)
        }, 10, idx);
    }
}

function showBoxText(idx) {
    $("#imgBox" + idx).css('display', 'none');
    $("#textBox" + idx).css('display', 'block');

    height = 0;
    increaseBoxTextHeight(idx);
}

function showBoxImg(idx) {
    $("#imgBox" + idx).css('display', 'block');
    $("#textBox" + idx).css('display', 'none');
}

let scrollAmount = 0;
let scrollAmountL = 4000;

function scrollDown() {

    scrollAmount += 100;

    $('#myTableParent').animate({
        scrollTop: scrollAmount
    },500);
}

function scrollUp() {

    scrollAmount = 0;

    $('#myTableParent').animate({
        scrollTop: 0
    }, 500);
}

function scrollRight() {

    scrollAmountL += 100;

    $('#myTableParent').animate({
        scrollLeft: scrollAmountL
    }, 500);

}

function myScrollLeft() {
    scrollAmountL = 0;

    $('#myTableParent').animate({
        scrollLeft: 0
    }, 500);
}

showdate();

function showdate() {
    week = new Array("يكشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه", "شنبه")
    months = new Array("فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور", "مهر", "آبان", "آذر", "دي", "بهمن", "اسفند");
    a = new Date();
    d = a.getDay();
    day = a.getDate();
    month = a.getMonth() + 1;
    year = a.getYear();
    if (year == 0) {
        year = 2000;
    }
    if (year < 100) {
        year += 1900;
    }
    y = 1;
    for (i = 0; i < 3000; i += 4) {
        if (year == i) {
            y = 2;
        }
    }
    for (i = 1; i < 3000; i += 4) {
        if (year == i) {
            y = 3;
        }
    }
    if (y == 1) {
        year -= ((month < 3) || ((month == 3) && (day < 21))) ? 622 : 621;

        switch (month) {
            case 1:
                (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
                break;
            case 2:
                (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
                break;
            case 3:
                (day < 21) ? (month = 12, day += 9) : (month = 1, day -= 20);
                break;
            case 4:
                (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
                break;
            case 5:
            case 6:
                (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
                break;
            case 7:
            case 8:
            case 9:
                (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
                break;
            case 10:
                (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
                break;
            case 11:
            case 12:
                (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
                break;
            default:
                break;
        }
    }
    if (y == 2) {
        year -= ((month < 3) || ((month == 3) && (day < 20))) ? 622 : 621;

        switch (month) {
            case 1:
                (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
                break;
            case 2:
                (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
                break;
            case 3:
                (day < 20) ? (month = 12, day += 10) : (month = 1, day -= 19);
                break;
            case 4:
                (day < 20) ? (month = 1, day += 12) : (month = 2, day -= 19);
                break;
            case 5:
                (day < 21) ? (month = 2, day += 11) : (month = 3, day -= 20);
                break;
            case 6:
                (day < 21) ? (month = 3, day += 11) : (month = 4, day -= 20);
                break;
            case 7:
                (day < 22) ? (month = 4, day += 10) : (month = 5, day -= 21);
                break;
            case 8:
                (day < 22) ? (month = 5, day += 10) : (month = 6, day -= 21);
                break;
            case 9:
                (day < 22) ? (month = 6, day += 10) : (month = 7, day -= 21);
                break;
            case 10:
                (day < 22) ? (month = 7, day += 9) : (month = 8, day -= 21);
                break;
            case 11:
                (day < 21) ? (month = 8, day += 10) : (month = 9, day -= 20);
                break;
            case 12:
                (day < 21) ? (month = 9, day += 10) : (month = 10, day -= 20);
                break;
            default:
                break;
        }
    }
    if (y == 3) {
        year -= ((month < 3) || ((month == 3) && (day < 21))) ? 622 : 621;

        switch (month) {
            case 1:
                (day < 20) ? (month = 10, day += 11) : (month = 11, day -= 19);
                break;
            case 2:
                (day < 19) ? (month = 11, day += 12) : (month = 12, day -= 18);
                break;
            case 3:
                (day < 21) ? (month = 12, day += 10) : (month = 1, day -= 20);
                break;
            case 4:
                (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
                break;
            case 5:
            case 6:
                (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
                break;
            case 7:
            case 8:
            case 9:
                (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
                break;
            case 10:
                (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
                break;
            case 11:
            case 12:
                (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
                break;
            default:
                break;
        }
    }

    document.getElementById('date').innerHTML = week[d] + " " + day + " " + months[month - 1];
}

function changeCompareCeil(mode) {

    if(mode == "ceil") {
        $("#ceil").removeClass('calcBoxUnSelected').addClass('calcBoxSelected');
        $("#compare").removeClass('calcBoxSelected').addClass('calcBoxUnSelected');
        $(".compareDiv").addClass('hidden');
        $(".calcDiv").removeClass('hidden');
    }
    else {
        $("#compare").removeClass('calcBoxUnSelected').addClass('calcBoxSelected');
        $("#ceil").removeClass('calcBoxSelected').addClass('calcBoxUnSelected');
        $(".calcDiv").addClass('hidden');
        $(".compareDiv").removeClass('hidden');
    }

}

function calcAmount() {

    let unpure = parseInt($("#unpure").val());
    if(isNaN(unpure))
        unpure = 0;

    let pure = parseInt($("#pure").val());
    if(isNaN(pure))
        pure = 0;

    let wage = parseInt($("#wage").val());
    if(isNaN(wage))
        wage = 0;

    let operator = parseInt($("#operator").val());
    if(isNaN(operator))
        operator = 0;

    let other = parseInt($("#other").val());
    if(isNaN(other))
        other = 0;

    let out = pure / 2.0 +
        unpure / 2.0 +
        wage * 3.0 +
        operator / 2.0 +
        other / 2.0;

    $("#resultCalc").html(out + " ریال");
}

function changeNeededCeil(mode) {

    if(mode == "ceil") {
        $("#ceil").removeClass('neededInfoBoxUnSelected').addClass('neededInfoBoxSelected');
        $("#compare").removeClass('neededInfoBoxSelected').addClass('neededInfoBoxUnSelected');
        $(".compareDiv").addClass('hidden');
        $(".calcDiv").removeClass('hidden');
    }
    else {
        $("#compare").removeClass('neededInfoBoxUnSelected').addClass('neededInfoBoxSelected');
        $("#ceil").removeClass('neededInfoBoxSelected').addClass('neededInfoBoxUnSelected');
        $(".calcDiv").addClass('hidden');
        $(".compareDiv").removeClass('hidden');
    }
}

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    document.addEventListener('wheel', preventDefault, {passive: false}); // Disable scrolling in Chrome
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    document.removeEventListener('wheel', preventDefault, {passive: false}); // Enable scrolling in Chrome
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function showNews(idx) {

    disableScroll();

    $("#headerInPopUp").empty().append($("#headerNews" + idx).html());
    $("#bodyInPopUp").empty().append($("#news" + idx).html());
    $("#picInPopUp").attr('src', $("#imgNews" + idx).attr('src'));

    $("#newsPopUp").removeClass('hidden');
    $(".dark").removeClass('hidden');

}

function showBlindness() {

    disableScroll();

    $("#headerInPopUp").empty().append("<p style='width: 90%'>" + $("#headerBlindness").html() +"</p>");
    $("#bodyInPopUp").empty().append($("#blindnessText").html());

    $("#newsPopUp").removeClass('hidden');
    $(".dark").removeClass('hidden');

}

function closeNewsPopUp() {

    enableScroll();

    $("#newsPopUp").addClass('hidden');
    $(".dark").addClass('hidden');
}

function toggleProfileMenu() {

    let elem = $(".firstPageProfileBtnMenu");

    if(elem.hasClass('hidden'))
        elem.removeClass('hidden');
    else
        elem.addClass('hidden');
}