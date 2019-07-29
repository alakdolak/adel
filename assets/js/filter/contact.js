
let selectedCityTmp = -1;
let selectedStateTmp = -1;

$("#stateSelect").on('change', function () {
    changeState($(this).val());
});

$(document).ready(function () {

    selectedCityTmp = $("#selectedCityTmp").attr('data-val');
    selectedStateTmp = $("#selectedStateTmp").attr('data-val');

    if(selectedCityTmp !== undefined && selectedCityTmp != -1)
        changeSelectedState(selectedStateTmp, selectedCityTmp);

    $(function () {
        $("#ceoAddress").farsiInput();
    });
});

$("#stateSelect2").on('change', function () {
    changeState($(this).val());
});