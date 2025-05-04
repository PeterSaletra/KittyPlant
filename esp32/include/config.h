#ifndef CONFIG_H
#define CONFIG_H// GPIO pin definitions

#define PIN_RED    23 // GPIO23
#define PIN_GREEN  22 // GPIO22
#define PIN_BLUE   21 // GPIO21
#define PIN_SENSOR A0 // SVP

// MQTT client
const char* hostname = "kp-0001";
const char* topic = "kp-0001/data";

// WiFi credentials
const char* ssidAP = "Test";
const char* passwordAP = "testtest";

//MQTT server
const char* mqtt_server = "192.168.1.103";
const int port = 1883;
const char* mqtt_user = "kitty_mqtt";
const char* mqtt_password = "password";

#endif