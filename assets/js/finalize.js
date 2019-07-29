
$("#farayandHeaderReqCodeBtn").on('click', function () {
    finalize();
});

$("#finalizeClosePopUpBtn").on('click', function () {
    closeFinalizePopUp();
});


function finalize() {

    $.ajax({
        type: 'post',
        url: '/finalize/' + $("#instId").attr('data-val'),
        success: function (response) {

            response = JSON.parse(response);

            if(response.status === "nok") {

                response = response.items;
                let newElement = "";

                for (let i = 0; i < response.length; i++) {

                    newElement += "<div style='border: 1px dashed; padding: 5px; margin: 7px'>";
                    if (response[i].url.length > 0)
                        newElement += "<a class='btn btn-warning' target='_blank' href='" + response[i].url + "'>رفتن برای تکمیل نواقص " + response[i].section + "</a>";
                    else
                        newElement += "<a class='btn btn-warning' target='_blank'>" + response[i].section + "</a>";

                    if(typeof response[i].err !== "undefined")
                        newElement += "<p style='color: red'>" + response[i].err + "</p>";

                    newElement += "<ul>";
                    for (let j = 0; j < response[i].items.length; j++) {
                        newElement += "<li>" + response[i].items[j] + "</li>";
                    }

                    newElement += "</ul>";
                    newElement += "</div>";
                }

                $("#finalizeErrors").empty().append(newElement);
                $("#finalizePopUp").removeClass('hidden');
            }
            else {
                document.location.href = "/profile";
            }
        }
    });
}

function closeFinalizePopUp() {
    $("#finalizePopUp").addClass('hidden');
}