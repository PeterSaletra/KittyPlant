#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <Wire.h>
#include <MQTTClient.h>
#include "config.h"
#include "helpers.h"
#include "wifi_portal.h"
#include "water_sensor.h"


WiFiClient espClient;
MQTTClient client(512);

bool relayWasActive = false;

uint32_t sleepDuration = SLEEP_DURATION_SEC;


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
  Wire.begin();
  pinMode(PIN_RED,   OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE,  OUTPUT);
  pinMode(PIN_RELAY, OUTPUT);

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
    int moisture_raw_value = analogRead(PIN_SENSOR);
    Serial.print("Sensor Value: ");
    Serial.println(moisture_raw_value);

    int moisture_level = 100 - map(moisture_raw_value, 0, 4095, 0, 100);
    Serial.printf("Moisture Level: %d%%\n", moisture_level);
    int8_t water_level = get_water_level();
    Serial.printf("Water Level: %d%%\n", water_level);

    bool relayActive = false;
    if (water_level > 20 && moisture_level < 60) {
      digitalWrite(PIN_RELAY, LOW);
      blinkColor(255, 0, 0);
      Serial.println("Relay ON - podlewanie");
      relayActive = true;
    } else {
      digitalWrite(PIN_RELAY, HIGH);
      if (water_level <= 20) {
        blinkColor(255, 255, 0);
        Serial.println("Relay OFF - brak wody w zbiorniku");
      } else {
        blinkColor(0, 0, 255);
        Serial.println("Relay OFF - wilgotność OK");
      }
    }

    if (relayActive && !relayWasActive) {
      Serial.println(">>> Relay został WŁĄCZONY w tym cyklu");
      sleepDuration = SLEEP_DURATION_SEC / 2;
      if (sleepDuration < 1) sleepDuration = 1;
    } else if (!relayActive && relayWasActive) {
      Serial.println(">>> Relay został WYŁĄCZONY w tym cyklu");
      sleepDuration = SLEEP_DURATION_SEC * 2;
    } else if (!relayActive) {
      sleepDuration = SLEEP_DURATION_SEC * 3;
    }
    relayWasActive = relayActive;

    Serial.printf("Czas snu: %d sekund\n", sleepDuration);

    char buffer[256];
    JsonDocument doc;
    doc["moisture_level"] = moisture_level;
    doc["water_section"] = water_level;
    doc["relay_activated"] = (relayActive && !relayWasActive) ? 1 : 0;

    size_t n = serializeJson(doc, buffer);
    client.publish(topic, buffer, n);

    if (!relayWasActive) {
      esp_sleep_enable_timer_wakeup(sleepDuration * uS_TO_S_FACTOR);
      esp_light_sleep_start();
    }

  }
}
