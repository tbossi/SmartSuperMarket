var UPDATED_STATUS = "updatedStatus";

$(document).ready(function () {
    var socket = io.connect();
    socket.on('connect', function () {
        socket.on(UPDATED_STATUS, onStatusChange);
    });

    function onStatusChange(data) {
        var deviceName = data.device.name;
        var sensorId = data.device.sensors[0].id;
        var newValue = data.device.sensors[0].result.value;
        $("#" + deviceName).find("#" + sensorId).find("span").text(newValue);
    }
});