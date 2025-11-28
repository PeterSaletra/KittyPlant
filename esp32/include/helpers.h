#ifndef HELPERS_H
#define HELPERS_H
#include <Arduino.h>
#include <esp_wifi.h>
#include <WiFi.h>
#include "config.h"

void readMacAddress();
void setColor(int red, int green, int blue);  
void blinkColor(int red, int green, int blue, int delayTime = 500);
void signalNoWifiConnection(const String& ssid, const String& password);

#endif // HELPERS_H