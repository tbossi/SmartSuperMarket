var UPDATED_STATUS = "updatedStatus";

$(document).ready(function () {
    var socket = io.connect();
    socket.on('connect', function () {
        socket.on(UPDATED_STATUS, onStatusChange);
    });
    $("#submit-button").click(onSubmitButtonClick);
});

function onSubmitButtonClick() {
    let selectedSensor = $('#sensors-selcet option:selected');
    let sensorName = selectedSensor.val();
    let array_id = selectedSensor.parent().attr('id');
    let text_value = $('#set-value-input').val();

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = this.responseText;
            var responseContainer = $('#response');
            responseContainer.html("<p>" + response + "</p>");
            setTimeout(function() {
                responseContainer.empty();
            }, 5000);
        }
    };
    xmlhttp.open("POST", "/devices/set");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({id: sensorName, devices_id: array_id, text: text_value}));
}

function onStatusChange(data) {
    console.log(data);
    var deviceName = data.device.name;
    var sensorId = data.device.sensors[0].id;
    var newValue = data.device.sensors[0].result.value;

    newValue = JSON.stringify(newValue);

    var updatedClass = "just-updated";
    var span = $("#" + deviceName).find("#" + sensorId).find("span");
    span.text(newValue);
    span.addClass(updatedClass);
    setTimeout(function () {
        span.removeClass(updatedClass);
    }, 1000);
}