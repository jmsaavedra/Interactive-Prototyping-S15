
//*******************************************
/* P5.JS !!
* - Processing in the browser
* - http://p5js.org/reference/
*
*/
var mappedX, mappedY, mappedZ;

function setup() {
  createCanvas(windowWidth, 500);
}

function draw() {
  background(200);
  
  // Draw a circle
  stroke(50);
  fill(50,0,255);
  ellipse(mappedX, mappedY, 24, 24);
  
  fill(0);
  textSize(42);
  text("x: "+int(mappedX), 50, 50);
  text("y: "+int(mappedY), 50, 100);
  text("z: "+int(mappedZ), 50, 150);
}


//*******************************************
/* DEVICE MOTION !!!
*
*  https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent
* https://developer.mozilla.org/en-US/docs/Web/API/DeviceAcceleration
// DeviceMotionEvent.acceleration
// DeviceMotionEvent.accelerationIncludingGravity
// DeviceMotionEvent.rotationRate
// DeviceMotionEvent.interval 
*
*/

function handleMotionEvent(event) {

    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;
    //document.getElementById("pos").innerHTML = "x: " + x + "<br />y: " + y + "<br />z: " + z;
        
    mappedX = map(x, -10.0, 10.0, 0, windowWidth);
    mappedY = map(y, -10.0, 10.0, 0, 500);
    mappedZ = map(z, -10.0, 10.0, 0, 500);
    //document.getElementById("pos").innerHTML = "x: " + mappedX + "<br />y: " + mappedY + "<br />z: " + z;
    //$('#pos').hide();
}
window.addEventListener('devicemotion', handleMotionEvent, true);



/*
* DEVICE ORIENTATION !!!
* https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent
// DeviceOrientationEvent.absolute
// DeviceOrientationEvent.alpha
// DeviceOrientationEvent.beta
// DeviceOrientationEvent.gamma
*/
function handleOrientationEvent(event){
  // document.getElementById("orientation").innerHTML = 'alpha: '+event.alpha + '<br>beta : ' + event.beta + '<br>gamma : ' + event.gamma;
  $('#orientation').html('alpha: '+event.alpha + '<br>beta : ' + event.beta + '<br>gamma : ' + event.gamma+'<br>');
}

window.addEventListener('deviceorientation',handleOrientationEvent); 


/*
* DEVICE LIGHT ???
* https://developer.mozilla.org/en-US/docs/Web/API/DeviceLightEvent
*/

function handleLightEvent(event){
  // document.getElementById("light").innerHTML = "light: "+event.value;
  $('#light').text("light: "+event.value);
}

window.addEventListener('devicelight', handleLightEvent, true);
