#include <WebServer.h>
#include <DNSServer.h>
#include "WebPage.h"
#include "helpers.h"

DNSServer dnsServer;
WebServer server(80);

String ssid;
String password;

bool gotCredentials = false;

void hanndlePage(){
    server.send(200, "text/html", webpage);   
  }
  
void handleConnect(){
    ssid = server.arg("ssid");
    password = server.arg("password");

    server.send(200, "text/html", connecting_page);
    delay(1000);
    gotCredentials = true;
}

void run_wifi_portal(){
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
        blinkColor(255, 255, 255);
        Serial.println("Waiting for credentials...");
    }
    server.stop();
}