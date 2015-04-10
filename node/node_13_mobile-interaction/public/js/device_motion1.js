function handleMotionEvent(event) {

    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;

    // Do something awesome.

    console.log('x: '+x+'  y: '+y+'  z: '+z);
    document.getElementById("pos").innerHTML = "x: " + x + "<br />y: " + y + "<br />z: " + z;
}

window.addEventListener("devicemotion", handleMotionEvent, true);