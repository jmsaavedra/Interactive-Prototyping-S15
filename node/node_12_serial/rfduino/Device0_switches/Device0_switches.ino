/*
This sketch demonstrates how to send data from a Device
to a Host in a Gazell network.

When Button A on the Device is pressed and released,
the green led on the host will toggle.
*/

#include <RFduinoGZLL.h>

device_t role = DEVICE0;

// pin for Button A on the RGB Shield
int button_a = 5;

// debounce time (in ms)
int debounce_time = 10;
int switchPins[6] = {1,2,3,4,5,6};
int numSwitches = 6;

// maximum debounce timeout (in ms)
int debounce_timeout = 100;

// starting state is off
char state = 0;

void setup()
{
  pinMode(button_a, INPUT);
  for(int i=0;i<numSwitches;i++){
    pinMode(switchPins[i],INPUT);
  }

  // start the GZLL stack
  RFduinoGZLL.begin(role);
  Serial.begin(57600);
}

int debounce(int button, int state)
{
  int start = millis();
  int debounce_start = start;
  
  while (millis() - start < debounce_timeout)
    if (digitalRead(button) == state)
    {
      if (millis() - debounce_start >= debounce_time)
        return 1;
    }
    else
      debounce_start = millis();

  return 0;
}

int delay_until_button(int button, int state)
{
  while (! debounce(button, state))
    ;
}

void loop()
{
  //delay_until_button(button_a, HIGH);
  
  // toggle state
  char switches[6] = {'a', 'r', 'd', 'u', 'i','i'};
  //int switches[6]={0,0,0,0,0,0};
  //byte switches;
  for(int i=0;i<numSwitches;i++){
    switches[i] = digitalRead(switchPins[i]);
    Serial.print(int(switches[i]));Serial.print("\t");
  }
  Serial.println();
  
  //state = ! state;

  // send state to Host
  RFduinoGZLL.sendToHost(switches,6);
  delay(100);
  
 // delay_until_button(button_a, LOW);
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{
}
