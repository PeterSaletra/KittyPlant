#include "helpers.h"

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
  
void blinkColor(int red, int green, int blue, int delayTime) {
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

// Funkcja kalibracji wilgotności z walidacją
int calibrateMoisture(int raw_value) {
  // Sprawdź czy wartość jest w dopuszczalnym zakresie
  if (raw_value < ADC_MIN_VALID) {
    Serial.println("WARNING: Sensor value too low - możliwe zwarcie!");
    return -1;
  }
  if (raw_value > ADC_MAX_VALID) {
    Serial.println("WARNING: Sensor value too high - możliwe odpięcie!");
    return -1;
  }
  
  // Mapowanie z kompensacją
  int moisture = map(raw_value, ADC_DRY, ADC_WET, 0, 100);
  moisture = constrain(moisture, 0, 100);
  
  return moisture;
}

// Funkcja sprawdzająca poprawność odczytu poziomu wody
bool isWaterLevelValid(int8_t level) {
  return (level >= 0 && level <= 100);
}