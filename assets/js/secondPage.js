
let selectedMode;
let selectedSubMode = -1;
let selectedIdx = -1;

$(document).ready(function () {
    selectedMode = $("#selectedMode").attr('data-val');
    getSpecificInstructions(selectedMode);
});

function changeSubMode(val) {

    if($("#ceil").hasClass('calcBoxSelected')) {
        changeCompareCeil('compare');
    }

    selectedSubMode = val;
    getSpecificInstructions(selectedIdx);
}

function getSpecificInstructions(idx) {

    selectedIdx = idx;

    $.ajax({

        type: 'post',
        url: '/getSpecificInstructions',
        data: {
            'mode': selectedMode,
            'subMode': selectedSubMode
        },
        success: function (res) {

            res = JSON.parse(res);


            let newElement = "";
            newElement += "<tr><td><center>تسهیلات</center></td>";
            newElement += "<td><center>نام طرح</center></td>";
            newElement += "<td><center>نوع شخصیت</center></td>";
            newElement += "<td><center>مدت زمان فرآیند</center></td>";
            newElement += "<td><center>نرخ بهره</center></td>";
            newElement += "<td><center>دوره تنفس</center></td>";
            newElement += "<td><center>پرداخت مرحله ای</center></td>";
            newElement += "<td><center>دوره بازپرداخت</center></td>";

            for(let i = 0; i < res.length; i++) {

                newElement += "<tr>";
                newElement += "<td><center>" + res[i].title + "</center></td>";
                newElement += "<td><center>" + res[i].name + "</center></td>";
                newElement += "<td><center>" + res[i].personality + "</center></td>";
                newElement += "<td>";
                newElement += "<center>" + res[i].duration + " روز</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].nerkh + "</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].tanafos + " ماه</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].payment_kind + " مرحله</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].bazpardakht_total + " ماه</center></td>";

                newElement += "<td>";
                newElement += "<center data-base='instruction' data-val=\"" + res[i].id + "\" class='btn redBtn redirectBtn'>شروع کنید</center></td>";
                newElement += "</tr>";
            }

            $("#table").empty().append(newElement);

            $(".redirectBtn").on('click', function () {
                document.location.href = $(this).attr('data-base') + "/" + $(this).attr('data-val');
            });
        }

    });

}

function getInstructions() {

    $.ajax({

        type: 'post',
        url: '/getInstructions',
        data: {
            'kind_personality': kind_personality,
            'activity_branch': activity_branch,
            'stateId': stateId,
            'parent': parent
        },
        success: function (res) {

            res = JSON.parse(res);

            let newElement = "";

            newElement += "<tr><td><center>نام طرح</center></td>";
            newElement += "<td><center>مدت زمان فرآیند</center></td>";
            newElement += "<td><center>نرخ بهره</center></td>";
            newElement += "<td><center>دوره تنفس</center></td>";
            newElement += "<td><center>پرداخت مرحله ای</center></td>";
            newElement += "<td><center>دوره بازپرداخت</center></td>";
            newElement += "<td><center>نوع تضمین</center></td>";

            for(let i = 0; i < res.length; i++) {

                newElement += "<tr class='coloredRow'>";
                newElement += "<td><center>" + res[i].name + "</center></td>";
                newElement += "<td>";
                newElement += "<center>" + res[i].duration + " روز</center></td>";

                newElement += "<td>";
                newElement += "<center>%" + res[i].nerkh + "</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].bazpardakht + " ماه</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].payment_kind + " مرحله</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].bazpardakht_total + " ماه</center></td>";

                newElement += "<td>";
                newElement += "<center>" + res[i].tazmin + "</center></td>";

                newElement += "<td>";
                newElement += "<center onclick='document.location.href = \"/instruction/" + res[i].id + "\"' class='btn redBtn'>شروع کنید</center></td>";
                newElement += "</tr>";
            }

            if(changeNo) {
                $("#total_result_no").empty().append(res.length + " مورد");
                $("#result1_no").empty().append(res.length + " مورد");
            }

            $("#table").empty().append(newElement);
        }

    });

}

$('.filter').on('click', function () {

    changeSubMode($(this).attr('data-filter'));

    $('html,body').animate({
            scrollTop: $(".compareDiv").offset().top},
        'slow');

});