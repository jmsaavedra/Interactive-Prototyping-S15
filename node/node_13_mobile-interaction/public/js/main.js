
var socket = io();
var ledState = 0;

// Whenever the server emits 'typing', show the typing message
socket.on('event', function (data) {
	console.log("received from server: "+data);
	$( '#mousedata' ).append("<div>"+ data +"</div>");
	var len = $( "div" ).length;
	if (len > 30) {
		$("#mousedata").empty();
	}
});


$( "#clickme").click(function(event){
	if(ledState == 0){ //LED is currently off
		$( "#clickme").css('background-color', '#0000FF');
		ledState = 1;
		socket.emit('click', 1);
	} else {
		$( "#clickme").css('background-color', '#FF0000');
		ledState = 0;
		socket.emit('click', 0);
	}
});



$( "body" ).mousemove(function(event){
	var msg = "event handler for mousemove: ";
	msg += event.pageX + ", "+event.pageY;
	//console.log(msg);

	var myData = {
		x: event.pageX,
		y: event.pageY
	}

	socket.emit('event', myData);

	// $( '#mousedata' ).append("<div>"+msg+"</div>");
	// var len = $( "div" ).length;
	// if (len > 25) {
	// 	 $("#mousedata").empty();
	// }
});


// function uintToString(uintArray) {
// 	var encodedString = String.fromCharCode.apply(null, uintArray),
// 	decodedString = decodeURIComponent(escape(encodedString));
// 	return decodedString;
// }