#include "spiffs_helper.h"

void init_spiffs() {
    if (!SPIFFS.begin(true)) {
        Serial.println("An error has occurred while mounting SPIFFS");
    } else {
        Serial.println("SPIFFS mounted successfully");
    }
}

String read_ca_cert(){
    File file = SPIFFS.open("/ca.crt", "r");
    if (!file) {
        Serial.println("Failed to open ca.crt");
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
    File file = SPIFFS.open(String("/") + hostname + ".crt", "r");
    if (!file) {
        Serial.println("Failed to open device certificate");
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
    File file = SPIFFS.open(String("/") + hostname + ".key", "r");
    if (!file) {
        Serial.println("Failed to open device key");
        return String();
    }

    String content;
    while (file.available()) {
        content += char(file.read());
    }
    file.close();
    return content;
}
