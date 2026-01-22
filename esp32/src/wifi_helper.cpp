#include "wifi_helper.h"

void setup_wifi(){
    WiFi.setHostname(hostname);
    WiFi.mode(WIFI_AP_STA);

    WiFi.softAP(ssidAP, passwordAP);

    run_wifi_portal();

    String ssid = get_value_string("ssid");
    String password = get_value_string("password");

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
}

void reconnect_wifi(){
    WiFi.disconnect();
    String ssid = get_value_string("ssid");
    String password = get_value_string("password");

    if (ssid.length() == 0 || password.length() == 0) {
        Serial.println("No stored Wi-Fi credentials found.");
        return;
    }
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        blinkColor(0, 0, 255);
        Serial.print(".");
    }

    Serial.println("\nReconnected to Wi-Fi!");
    Serial.print("ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
}