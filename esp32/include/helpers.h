#ifndef HELPERS_H
#define HELPERS_H

#include <Arduino.h>
#include <esp_wifi.h>
#include "config.h"


void readMacAddress(){
    uint8_t baseMac[6];
    esp_err_t ret = esp_wifi_get_mac(WIFI_IF_STA, baseMac);
    if (ret == ESP_OK) {
      Serial.print("Base MAC Address: ");
      Serial.printf("%02x:%02x:%02x:%02x:%02x:%02x\n",
                    baseMac[0], baseMac[1], baseMac[2],
                    baseMac[3], baseMac[4], baseMac[5]);
    } else {
      Serial.println("Failed to read MAC address");
    }
  }

void setColor(int red, int green, int blue) {
    analogWrite(PIN_RED,   red);
    analogWrite(PIN_GREEN, green);
    analogWrite(PIN_BLUE,  blue);
}
  
void blinkColor(int red, int green, int blue, int delayTime = 500) {
    setColor(red, green, blue);
    delay(delayTime);
    setColor(0, 0, 0);
    delay(delayTime);
}

void signalNoWifiConnection(const String& ssid, const String& password) {
    blinkColor(255, 0, 0);
    blinkColor(0, 0, 255);

    Serial.println("No Wi-Fi connection!");
    Serial.println("Reconnecting...");

    WiFi.disconnect();
    WiFi.begin(ssid, password);

    int retryCount = 0;
    while (WiFi.status() != WL_CONNECTED && retryCount < 10) {
        blinkColor(255, 0, 0);
        blinkColor(0, 0, 255); 
        Serial.print(".");
        retryCount++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nReconnected to Wi-Fi!");
        Serial.print("ESP32 IP Address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\nFailed to reconnect to Wi-Fi.");
    }
}

#endif // HELPERS_H