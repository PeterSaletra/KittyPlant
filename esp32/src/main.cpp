#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <MQTTClient.h>
#include "config.h"
#include "helpers.h"
#include "wifi_portal.h"


WiFiClient espClient;
MQTTClient client(512);


void reconnect() {
  while (!client.connected()) {
    client.connect(hostname, mqtt_user, mqtt_password);
  }
}


void callback(String &topic, String &payload) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  Serial.print("Water Level: ");
  Serial.println(doc["water_level"].as<int>());
  Serial.println("Message received!");
}


void setup() {
  Serial.begin(115200);
  pinMode(PIN_RED,   OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE,  OUTPUT);

  WiFi.setHostname(hostname);
  WiFi.mode(WIFI_AP_STA);

  WiFi.softAP(ssidAP, passwordAP);
  
  run_wifi_portal();

  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password, 0, NULL, true);

  readMacAddress();

  while (WiFi.status() != WL_CONNECTED) {
    blinkColor(0, 0, 255);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  client.begin(mqtt_server, port, espClient);
  client.setOptions(60, true, 60);
  client.connect(hostname, mqtt_user, mqtt_password);
  client.onMessage(callback);
  client.subscribe(topic);

  blinkColor(0, 255, 0); 
  blinkColor(0, 255, 0); 
  blinkColor(0, 255, 0); 
}


void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (WiFi.status() != WL_CONNECTED) {
    signalNoWifiConnection(ssid, password);
  } else {
    int sensorValue = analogRead(PIN_SENSOR);
    Serial.print("Sensor Value: ");
    Serial.println(sensorValue);

    int realValue = 100 - map(sensorValue, 0, 4095, 0, 100);
    Serial.printf("%d%%\n", realValue);

    char buffer[256];
    JsonDocument doc;
    doc["water_level"] = realValue;

    size_t n = serializeJson(doc, buffer);
    client.publish(topic, buffer, n);

    delay(1000); 
  }
}