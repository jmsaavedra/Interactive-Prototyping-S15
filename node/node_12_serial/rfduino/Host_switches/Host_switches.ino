/*
This sketch demonstrates how to send data from a Device
to a Host in a Gazell network.

The host and upto 3 devices should have the RGB shield
attached.  When Button A on a Device is pressed, the
associated led on the Host will toggle.  Device1 is
associated with the Red led, Device2 with the Green led
and Device3 with the Blue led.

The Green led on the Device will blink to indicate
that an acknowledgement from the Host was received.
*/

#include <RFduinoGZLL.h>

device_t role = HOST;

// pin for the Green Led
int green_led = 3;

void setup()
{
  pinMode(green_led, OUTPUT);

  // start the GZLL stack  
  RFduinoGZLL.begin(role);
  Serial.begin(57600);
}

void loop()
{
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{
  int switches[6];
  //Serial.println(len);
  for(int i =0;i<len;i++){
    switches[i] = int(data[i]);
    Serial.print(int(data[i]));
  }
  Serial.println();
  

  // this test is not needed for a single device

  // no data to piggyback on the acknowledgement sent back to the Device
  // RFduinoGZLL.sendToDevice(device, "OK");
}
