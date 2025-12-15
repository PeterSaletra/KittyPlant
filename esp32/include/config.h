#ifndef CONFIG_H
#define CONFIG_H// GPIO pin definitions

#define PIN_RED    25 // GPIO25
#define PIN_GREEN  26 // GPIO26
#define PIN_BLUE   27 // GPIO27
#define PIN_SENSOR A0 // SVP
#define PIN_RELAY  26 // SVN

#define WSENSOR_HIGH_ADDR   0x78
#define WSENSOR_LOW_ADDR   0x77

#define WSENSOR_NO_TOUCH       0xFE
#define WSENSOR_THRESHOLD      100

#define SLEEP_DURATION_SEC 5
#define uS_TO_S_FACTOR 1000000ULL

// MQTT client
const char* hostname = "kp-0001";
const char* topic =  hostname + "/data";
const char* commandTopic = hostname + "/commands";

// WiFi credentials
const char* ssidAP = "Test";
const char* passwordAP = "testtest";

//MQTT server
const char* mqtt_server = "192.168.1.103";
const int port = 1883;
const char* mqtt_user = "kitty_mqtt";
const char* mqtt_password = "password";

#endif