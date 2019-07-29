
function changeSelectedState(val, cityId) {

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

            for (let i = 0; i < res.length; i++) {

                if(parseInt(cityId) === parseInt(res[i].id))
                    newElement += "<option selected value='" +  res[i].id +"'>" + res[i].name + "</option>";
                else
                    newElement += "<option value='" +  res[i].id +"'>" + res[i].name + "</option>";
            }

            $("#citySelect").empty().append(newElement);
        }
    });
}