
$(document).ready(function () {
   doOrder($("#stepNo").attr('data-val'));
});

function doOrder(step) {
    step = parseInt(step);
    $(".step" + step + "Text").addClass('specialBoxSelected');
    $(".step" + (step + 1) + "Text").addClass('specialBoxConcaveSelected');
}