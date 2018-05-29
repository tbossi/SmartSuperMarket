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
    var sensorName = selectedSensor.val();
    var TCPPort = selectedSensor.parent().attr('id');
    var text = $('#set-value-input').val();
    console.log('click: ' + text);
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