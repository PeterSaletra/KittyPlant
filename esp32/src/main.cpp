#include <Arduino.h>
#include <WiFi.h>
#include <esp_wifi.h>
#include <WiFiMulti.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <HTTPClient.h>
#include "WebPage.h"
#include "WiFiCredentials.h"

#define PIN_RED    23 // GPIO23
#define PIN_GREEN  22 // GPIO22
#define PIN_BLUE   21 // GPIO21
#define PIN_SENSOR A0 // SVP

const char* ssidAP = "Test";
const char* passwordAP = "testtest";

DNSServer dnsServer;
WebServer server(80);

String ssid;
String password;

bool gotCredentials = false;

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

void signalNoWifiConnection() {
  blinkColor(255, 0, 0);
  blinkColor(0, 0, 255);
  Serial.println("No Wi-Fi connection!");
  Serial.println("Reconnecting...");
  
  WiFi.disconnect();
  WiFi.begin(SSID, PASSWORD);

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

void hanndlePage(){
  server.send(200, "text/html", webpage);   
}

void handleConnect(){
  ssid = server.arg("ssid");
  password = server.arg("password");

  server.send(200, "text/html", "<h1>Connecting...</h1>");
  delay(1000);
  gotCredentials = true;
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RED,   OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE,  OUTPUT);

  WiFi.setHostname("kp-0001");
  WiFi.mode(WIFI_AP_STA);

  WiFi.softAP(ssidAP, passwordAP);
  Serial.println("Access Point started");
  Serial.print("IP Address: ");
  Serial.println(WiFi.softAPIP());
  dnsServer.start(53, "*", WiFi.softAPIP());

  server.on("/", hanndlePage);
  server.on("/connect", HTTP_POST, handleConnect);
  server.on("/generate_204", []() {
    server.sendHeader("Location", "/");
    server.send(302, "text/plain", "");
  });
  
  // Apple captive portal trigger
  server.on("/hotspot-detect.html", []() {
    server.send(200, "text/html", webpage);
  });
  
  // Windows captive portal trigger
  server.on("/ncsi.txt", []() {
    server.send(200, "text/plain", "Microsoft NCSI");
  });
  server.on("/connecttest.txt", []() {
    server.send(200, "text/plain", "This is not Microsoft");
  });
  
  server.on("/redirect", []() {
    server.sendHeader("Location", "/");
    server.send(302, "text/plain", "");
  });
  server.begin();

  while(!gotCredentials){
    dnsServer.processNextRequest();
    server.handleClient();
    Serial.println("Waiting for credentials...");
  }
  server.stop();
  dnsServer.stop();

  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);

  readMacAddress();

  while (WiFi.status() != WL_CONNECTED) {
    blinkColor(0, 0, 255);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  blinkColor(0, 255, 0); 
  blinkColor(0, 255, 0); 
  blinkColor(0, 255, 0); 
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    signalNoWifiConnection();
  } else {
    int sensorValue = analogRead(PIN_SENSOR);
    Serial.print("Sensor Value: ");
    Serial.println(sensorValue);

    int realValue = 100 - map(sensorValue, 0, 4095, 0, 100);
    Serial.printf("%d%%\n", realValue);
    delay(1000); 
  }
}

