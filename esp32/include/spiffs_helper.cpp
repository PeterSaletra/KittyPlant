#include "spiffs_helper.h"

void init_spiffs() {
    if (!SPIFFS.begin(true)) {
        Serial.println("An error has occurred while mounting SPIFFS");
    } else {
        Serial.println("SPIFFS mounted successfully");
    }
}

String read_index_html() {
    File file = SPIFFS.open("/index.html", "r");
    if (!file) {
        Serial.println("Failed to open index.html");
        return String();
    }

    String content;
    while (file.available()) {
        content += char(file.read());
    }
    file.close();
    return content;
}

String ready_connection_html(){
    File file = SPIFFS.open("/connection.html", "r");
    if (!file) {
        Serial.println("Failed to open ready_connection.html");
        return String();
    }

    String content;
    while (file.available()) {
        content += char(file.read());
    }
    file.close();
    return content;
}

String read_ca_cert(){
    File file = SPIFFS.open("/ca_cert.pem", "r");
    if (!file) {
        Serial.println("Failed to open ca_cert.pem");
        return String();
    }

    String content;
    while (file.available()) {
        content += char(file.read());
    }
    file.close();
    return content;
}

String read_client_cert(){
    File file = SPIFFS.open("/client_cert.pem", "r");
    if (!file) {
        Serial.println("Failed to open client_cert.pem");
        return String();
    }

    String content;
    while (file.available()) {
        content += char(file.read());
    }
    file.close();
    return content;
}

String read_client_key(){
    File file = SPIFFS.open("/client_key.pem", "r");
    if (!file) {
        Serial.println("Failed to open client_key.pem");
        return String();
    }

    String content;
    while (file.available()) {
        content += char(file.read());
    }
    file.close();
    return content;
}