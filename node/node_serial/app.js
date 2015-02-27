var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/tty.usbserial-DC008P3L", {
  baudrate: 57600
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
    console.log('open');
    serialPort.on('data', function(data) {
      //console.log('data length: ' + data.length);
      if(data.length==8){
        //console.log('data received: ' + data);
        for(var i=0;i<6;i++){
          var value = parseInt(data[i])-48;
          console.log("DATA "+i+" = "+value);
        }
      }
    });
    serialPort.write("ls\n", function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
  }
});
