let selectedCity = -1;

$(".nopa").on('click', function () {
    document.location.href = '/nopa';
});

$(".antiNopa").on('click', function () {
    document.location.href = '/integration';
});

$(".investment").on('click', function () {
    document.location.href = '/investment';
});

$(".employee").on('click', function () {
    document.location.href = '/employee';
});

$("#followUpBtn").on('click', function () {
    followUp();
});

$("#kindPersonality").on('change', function () {
    changeKindPersonality($("#kindPersonality").val());
});

$("#activityBranch").on('change', function () {
    changeActivityBranch($("#activityBranch").val());
});

$("#stateSelect").on('change', function () {
    changeState($("#stateSelect").val());
    changeNo = true;
    getInstructions();
});

$("#tavanFilter").on('click', function () {
    changeFacility('tavan');
});

$("#madadFilter").on('click', function () {
    changeFacility('madad');
});

$("#shahidFilter").on('click', function () {
    changeFacility('shahid');
});

$("#janbazFilter").on('click', function () {
    changeFacility('janbaz');
});

$("#esarFilter").on('click', function () {
    changeFacility('esar');
});

$("#scrollNamesResponsiveOne").on('click', function () {
    if($('#instructionNamesResponsiveDiv').hasClass('hidden'))
        $('#instructionNamesResponsiveDiv').removeClass('hidden');
    else
        $('#instructionNamesResponsiveDiv').addClass('hidden')
});

$("#scrollUpSmooth").on('mouseenter', function () {
    scrollUpName();
});

$("#scrollDownSmooth").on('mouseenter', function () {
    scrollDownName();
});

$("#scrollDownSmooth").on('mouseleave', function () {
    myClearTimer();
});

$(document).ready(function () {
    getInstructions();
    getInstructionNames();
});

let kind_personality = -1;
let activity_branch = -1;
let stateId = -1;
let parent = -1;
let facility = -1;

let changeNo = true;

function changeParent(val) {
    parent = val;
    changeNo = false;
    getInstructions();
}

function changeKindPersonality(val) {
    kind_personality = val;
    changeNo = true;

    if(parseInt(val) === -1) {
        $(".hagh_hogh_0").removeClass('hidden');
        $(".hagh_hogh_1").removeClass('hidden');
    }
    else {
        let tmpVal = (parseInt(val) === 1) ? 0 : 1;
        $(".hagh_hogh_" + tmpVal).addClass('hidden');
        $(".hagh_hogh_" + val).removeClass('hidden');
    }
    getInstructions();
}

function changeActivityBranch(val) {
    activity_branch = val;
    changeNo = true;
    getInstructions();
}

function getInstructionNames() {

    $.ajax({

        type: 'post',
        url: '/getInstructionNames',
        success: function (res) {

            res = JSON.parse(res);

            let newElement = "";

            for(let i = 0; i < res.length; i++) {

                if(i === res.length - 1)
                    newElement += "<a href='/instruction/" + res[i].id + "' style='border-bottom: none !important;'>" + res[i].name + "</a>";
                else
                    newElement += "<a href='/instruction/" + res[i].id + "'>" + res[i].name + "</a>";
            }

            $("#instructionNames , #instructionNamesResponsiveDiv").empty().append(newElement);
        }
    });
}

let showHeader = false;

function printHeader() {

    let newElement = "";

    newElement += "<tr><th><center>نام طرح</center></th>";
    newElement += "<th><center>مدت زمان فرآیند</center></th>";
    newElement += "<th><center>نرخ بهره</center></th>";
    newElement += "<th><center>دوره تنفس</center></th>";
    newElement += "<th><center>پرداخت مرحله ای</center></th>";
    newElement += "<th><center>دوره بازپرداخت</center></th>";

    $("#tableHeader").append(newElement);
    showHeader = true;
}

$(document).on('click','.instructionRedirectorBtn',function() {
    document.location.href = "/instruction/" + $(this).attr('data-val');
});

function getInstructions() {

    $.ajax({

        type: 'post',
        url: '/getInstructions',
        data: {
            'kind_personality': kind_personality,
            'activity_branch': activity_branch,
            'stateId': stateId,
            'parent': parent,
            'facility': facility
        },
        success: function (res) {

            res = JSON.parse(res);

            let newElement = "";

            if(!showHeader)
                printHeader();

            for(let i = 0; i < res.length; i++) {

                newElement += "<tr class='coloredRow'>";
                newElement += "<td><center>" + res[i].name + "</center></td>";
                newElement += "<td>";
                newElement += "<center>" + res[i].duration + " روز</center></td>";

                newElement += "<td>";
                newElement += "<center>%" + res[i].nerkh + "</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].tanafos + " ماه</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].payment_kind + " مرحله</center></td>";

                newElement += "<td>";
                newElement += "<center class='pardakht'>" + res[i].pardakht + " ماه</center></td>";

                newElement += "<td>";
                newElement += "<center data-val='" + res[i].id + "' class='btn redBtn instructionRedirectorBtn'>شروع کنید</center></td>";
                newElement += "</tr>";
            }

            if(changeNo) {
                $("#result1_no").empty().append(res.length + " مورد");
                if(!$("#total_result_no").attr('data-filled')) {
                    $("#total_result_no").empty().append(res.length + " مورد").attr('data-filled', true);
                }
            }

            $("#table").empty().append(newElement);

            if(facility === -1)
                $(".pardakht").css('color', '#989595');
            else
                $(".pardakht").css('color', 'red');
        }

    });

}

function changeFacility(val) {

    if(facility === val) {
        facility = -1;
        changeNo = true;
        $(".shahidFilter").removeClass('checkBoxForShahid').addClass('emptyCheckBoxForShahid');
        getInstructions();
        return;
    }

    changeNo = true;
    facility = val;
    $(".shahidFilter").removeClass('checkBoxForShahid').addClass('emptyCheckBoxForShahid');
    $("#" + val + "Filter").removeClass('emptyCheckBoxForShahid').addClass('checkBoxForShahid');
    getInstructions();
}

function followUp() {

    let val = $("#followUpCode").val();

    if(val.length === 0)
        return;

    $.ajax({
        type: 'post',
        url: '/verifyFollowUpCode',
        data: {
            'code': val
        },
        success: function (res) {

            res = JSON.parse(res);

            if(res.status === "ok")
                document.location.href = res.url;
            else
                document.location.href = "/followCodeError";
        }
    });
}

let scrollAmountNames = 0;
let timer;

function doScroll() {

    if(scrollAmountNames >= 1000) {
        myClearTimer();
    }

    scrollAmountNames += 100;

    $('#instructionNames , #instructionNamesResponsiveDiv').animate({
        scrollTop: scrollAmountNames
    },500);

    timer = setTimeout(doScroll, 500);
}

function scrollDownName() {
    timer = setTimeout(doScroll, 500);
}

function myClearTimer() {
    clearTimeout(timer);
}

function scrollUpName() {

    scrollAmountNames = 0;

    $('#instructionNames , #instructionNamesResponsiveDiv').animate({
        scrollTop: scrollAmountNames
    },500);
}