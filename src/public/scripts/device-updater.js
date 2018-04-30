var UPDATED_STATUS = "updatedStatus";

var socket = io.connect();
socket.on('connect', function() {
    socket.on(UPDATED_STATUS, onStatusChange);
});

function onStatusChange(data) {
    console.log(data);
}