
function changeState(val) {

    stateId = val;

    $.ajax({

        type: 'post',
        url: '/getCities',
        data: {
            'stateId': stateId
        },
        success: function (res) {

            res = JSON.parse(res);

            let newElement = "";

            if(typeof selectedCity === "undefined") {
                for (let i = 0; i < res.length; i++) {
                    newElement += "<option value='" + res[i].id + "'>" + res[i].name + "</option>";
                }
            }
            else {
                for (let i = 0; i < res.length; i++) {
                    if (selectedCity === res[i].id)
                        newElement += "<option selected value='" + res[i].id + "'>" + res[i].name + "</option>";
                    else
                        newElement += "<option value='" + res[i].id + "'>" + res[i].name + "</option>";
                }
            }

            $("#citySelect").empty().append(newElement);
        }
    });
}

function changeState2(val) {

    if(val == -1)
        return;

    stateId = val;

    $.ajax({

        type: 'post',
        url: '/getCities2',
        data: {
            'stateId': stateId
        },
        success: function (res) {

            res = JSON.parse(res);

            let newElement = "";

            if(typeof selectedCity === "undefined") {
                for (let i = 0; i < res.length; i++) {
                    newElement += "<option value='" + res[i].id + "'>" + res[i].name + "</option>";
                }
            }
            else {

                for (let i = 0; i < res.length; i++) {
                    if (selectedCity === res[i].id)
                        newElement += "<option selected value='" + res[i].id + "'>" + res[i].name + "</option>";
                    else
                        newElement += "<option value='" + res[i].id + "'>" + res[i].name + "</option>";
                }
            }

            $("#citySelect").empty().append(newElement);
        }
    });
}