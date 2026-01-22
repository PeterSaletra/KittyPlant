#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>
#include <Wire.h>
#include <MQTTClient.h>
#include "config.h"
#include "helpers.h"
#include "wifi_portal.h"
#include "water_sensor.h"
#include "nvs_helper.h"
#include "wifi_helper.h"
#include "spiffs_helper.h"

WiFiClientSecure espClient;
MQTTClient client(512);

bool relayWasActive = false;
uint32_t sleepDuration = SLEEP_DURATION_SEC;

// === ZMIENNE DLA TIMINGU I WYKRYWANIA AWARII ===
unsigned long lastWateringStart = 0;
unsigned long lastWateringEnd = 0;
unsigned long wateringStartTime = 0;
int consecutiveErrorCount = 0;

// === KONFIGURACJA Z BACKENDU ===
bool configReceived = false;
int moistureLowThreshold = MOISTURE_LOW_THRESHOLD_DEFAULT;
int moistureHighThreshold = MOISTURE_HIGH_THRESHOLD_DEFAULT;


void reconnect() {
  while (!client.connected()) {
    client.connect(hostname);
  }
}

void callback(String &topic, String &payload) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  Serial.println(payload);

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  
  // Obsługa wiadomości setup z konfiguracją
  if (topic == mqtt_setup_topic) {
    if (doc.containsKey("moisture_low_threshold") && doc.containsKey("moisture_high_threshold")) {
      moistureLowThreshold = doc["moisture_low_threshold"].as<int>();
      moistureHighThreshold = doc["moisture_high_threshold"].as<int>();
      
      // Walidacja otrzymanych wartości
      if (moistureLowThreshold < 0 || moistureLowThreshold > 100 ||
          moistureHighThreshold < 0 || moistureHighThreshold > 100 ||
          moistureLowThreshold >= moistureHighThreshold) {
        Serial.println("ERROR: Nieprawidłowe wartości progów! Używam domyślnych.");
        moistureLowThreshold = MOISTURE_LOW_THRESHOLD_DEFAULT;
        moistureHighThreshold = MOISTURE_HIGH_THRESHOLD_DEFAULT;
      } else {
        configReceived = true;
        Serial.println("=== KONFIGURACJA OTRZYMANA ===");
        Serial.printf("Progi wilgotności ustawione: %d%% - %d%%\n", moistureLowThreshold, moistureHighThreshold);
        blinkColor(0, 255, 0);
        blinkColor(0, 255, 0);
      }
    } else {
      Serial.println("WARNING: Brak wymaganych pól w konfiguracji!");
    }
  }
  else if (topic == commandTopic) {
    const char* command = doc["command"];
    
    switch (command)
    {
    case "find":
      Serial.println("Executing 'find' command: Blinking LED");
      for (int i = 0; i < 10; i++) {
        blinkColor(255, 255, 255, 200); 
      }
      break;
    case "restart":
      Serial.println("Executing 'restart' command: Restarting device");
      ESP.restart();
      break;
    case "water":
      Serial.println("Executing 'water' command: Activating relay for watering");
      digitalWrite(PIN_RELAY, LOW); 
      delay(5000); 
      digitalWrite(PIN_RELAY, HIGH); 
      Serial.println("Watering completed.");
      break;
    default:
      break;
    }
  }

  Serial.print("Water Level: ");
  Serial.println(doc["water_level"].as<int>());
  Serial.println("Message received!");
}


void setup() {
  Serial.begin(115200);
  Wire.begin();

  init_spiffs();

  pinMode(PIN_RED,   OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE,  OUTPUT);
  pinMode(PIN_RELAY, OUTPUT);
  
  // Bezpiecznie wyłącz przekaźnik na starcie
  digitalWrite(PIN_RELAY, HIGH);

  init_nvs();
  init_preferences("kitty-namespace");

  setup_wifi();

  String ca_cert = read_ca_cert();
  String client_cert = read_client_cert();
  String private_key = read_client_key();

  espClient.setCACert(ca_cert.c_str());
  espClient.setCertificate(client_cert.c_str());
  espClient.setPrivateKey(private_key.c_str());

  client.begin(mqtt_server, port, espClient);
  client.connect(hostname);
  client.onMessage(callback);
<<<<<<< HEAD
  client.subscribe(mqtt_topic);
  client.subscribe(mqtt_setup_topic);
  client.subscribe(topic);
  client.subscribe(commandTopic);
=======
  client.subscribe(mqtt_topic, 2);
  client.subscribe(mqtt_setup_topic, 2);
>>>>>>> 9907a4b (Changes in main.cpp)

  blinkColor(0, 255, 0); 
  blinkColor(0, 255, 0); 
  blinkColor(0, 255, 0);
  
  Serial.println("=== OCZEKIWANIE NA KONFIGURACJĘ Z BACKENDU ===");
  Serial.printf("Subskrybowano topic: %s\n", mqtt_setup_topic);
  Serial.println("Czekam na dane o progach wilgotności...");
  Serial.println("ESP32 pozostanie w trybie oczekiwania aż serwer wyśle konfigurację.");
  
  // Czekaj na konfigurację z backendu (bez timeoutu)
  while (!configReceived) {
    if (!client.connected()) {
      Serial.println("Utracono połączenie MQTT, próbuję ponownie połączyć...");
      client.connect(hostname);
      client.subscribe(mqtt_setup_topic);
      delay(1000);
    }
    client.loop();
    blinkColor(255, 255, 0, 200); // Żółty migający = oczekiwanie
    delay(100);
  }
  
  Serial.println("=== KONFIGURACJA SYSTEMU ===");
  Serial.printf("Próg wilgotności: %d%% - %d%%\n", moistureLowThreshold, moistureHighThreshold);
  Serial.printf("Próg wody: %d%% - %d%%\n", WATER_LOW_THRESHOLD, WATER_SAFE_THRESHOLD);
  Serial.printf("Max czas podlewania: %lu s\n", MAX_WATERING_TIME / 1000);
  Serial.printf("Cooldown: %lu s\n", COOLDOWN_AFTER_WATERING / 1000);
  Serial.println("=== START GŁÓWNEJ PĘTLI ===");
}


void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (WiFi.status() != WL_CONNECTED) {
    reconnect_wifi();
  } else {
    unsigned long currentTime = millis();
    
    // === ODCZYT I WALIDACJA CZUJNIKA WILGOTNOŚCI ===
    int moisture_raw_value = analogRead(PIN_SENSOR);
    Serial.printf("ADC Raw: %d\n", moisture_raw_value);
    
    int moisture_level = calibrateMoisture(moisture_raw_value);
    
    if (moisture_level < 0) {
      consecutiveErrorCount++;
      Serial.printf("Błąd wilgotności! Licznik błędów: %d/%d\n", consecutiveErrorCount, MAX_ERROR_COUNT);
      
      if (consecutiveErrorCount >= MAX_ERROR_COUNT) {
        Serial.println("CRITICAL: Za dużo błędów sensora wilgotności! Wyłączam system.");
        digitalWrite(PIN_RELAY, HIGH);
        blinkColor(255, 0, 255); // Magenta = krytyczny błąd
        
        char buffer[128];
        JsonDocument doc;
        doc["error"] = "moisture_sensor_failure";
        doc["consecutive_errors"] = consecutiveErrorCount;
        size_t n = serializeJson(doc, buffer);
        client.publish(mqtt_topic, buffer, n);
        
        delay(30000); // 30s delay przed restartem
        ESP.restart();
      }
      
      delay(5000);
      return;
    }
    
    consecutiveErrorCount = 0; // Reset licznika przy poprawnym odczycie
    Serial.printf("Moisture Level: %d%% (calibrated)\n", moisture_level);

    // === ODCZYT I WALIDACJA POZIOMU WODY ===
    int8_t water_level = get_water_level();
    
    if (!isWaterLevelValid(water_level)) {
      Serial.println("ERROR: Nieprawidłowy odczyt poziomu wody!");
      digitalWrite(PIN_RELAY, HIGH); // Bezpiecznie wyłącz
      blinkColor(255, 0, 255);
      
      char buffer[128];
      JsonDocument doc;
      doc["error"] = "water_sensor_error";
      doc["water_level"] = water_level;
      size_t n = serializeJson(doc, buffer);
      client.publish(mqtt_topic, buffer, n);
      
      delay(10000);
      return;
    }
    
    Serial.printf("Water Level: %d%%\n", water_level);

    // === LOGIKA PODLEWANIA Z HISTEREZĄ I ZABEZPIECZENIAMI ===
    bool relayActive = relayWasActive;
    bool canWater = true;
    String statusMsg = "";
    
    // 1. Sprawdź cooldown po ostatnim podlewaniu
    if (lastWateringEnd > 0 && (currentTime - lastWateringEnd) < COOLDOWN_AFTER_WATERING) {
      canWater = false;
      statusMsg = "Cooldown period";
      Serial.printf("COOLDOWN: Pozostało %lu s\n", (COOLDOWN_AFTER_WATERING - (currentTime - lastWateringEnd)) / 1000);
    }
    
    // 2. Sprawdź minimalny odstęp między cyklami
    if (lastWateringStart > 0 && (currentTime - lastWateringStart) < MIN_CYCLE_INTERVAL) {
      canWater = false;
      statusMsg = "Too soon since last cycle";
    }
    
    // 3. Sprawdź maksymalny czas podlewania (safety cutoff)
    if (relayWasActive && (currentTime - wateringStartTime) > MAX_WATERING_TIME) {
      relayActive = false;
      canWater = false;
      statusMsg = "Max watering time exceeded - SAFETY CUTOFF";
      Serial.println("SAFETY: Wyłączam pompę - przekroczono max czas podlewania!");
      lastWateringEnd = currentTime;
    }
    
    // 4. Logika z histerezą dla poziomu wody
    bool hasWater = false;
    if (relayWasActive) {
      hasWater = (water_level > WATER_LOW_THRESHOLD);
    } else {
      hasWater = (water_level > WATER_SAFE_THRESHOLD);
    }
    
    // 5. Logika z histerezą dla wilgotności (używa progów z backendu)
    if (canWater && hasWater) {
      if (relayWasActive) {
        // Podlewamy - wyłącz gdy osiągniemy wysoki próg
        if (moisture_level >= moistureHighThreshold) {
          relayActive = false;
          lastWateringEnd = currentTime;
          statusMsg = "Target moisture reached";
          Serial.println("✓ Wyłączam - osiągnięto docelową wilgotność");
        } else {
          statusMsg = "Watering in progress";
        }
      } else {
        // Nie podlewamy - włącz gdy spadniemy poniżej niskiego progu
        if (moisture_level < moistureLowThreshold) {
          relayActive = true;
          wateringStartTime = currentTime;
          lastWateringStart = currentTime;
          statusMsg = "Starting watering cycle";
          Serial.println("→ Włączam podlewanie");
        } else {
          statusMsg = "Moisture OK";
        }
      }
    } else if (!hasWater) {
      relayActive = false;
      statusMsg = "Insufficient water";
    }

    // === STEROWANIE PRZEKAŹNIKIEM ===
    if (relayActive) {
      digitalWrite(PIN_RELAY, LOW);
      blinkColor(255, 0, 0);
      Serial.printf("🚿 RELAY ON - %s (czas: %lu s)\n", statusMsg.c_str(), (currentTime - wateringStartTime) / 1000);
    } else {
      digitalWrite(PIN_RELAY, HIGH);
      if (!hasWater) {
        blinkColor(255, 255, 0);
        Serial.printf("⚠ RELAY OFF - %s\n", statusMsg.c_str());
      } else {
        blinkColor(0, 0, 255);
        Serial.printf("✓ RELAY OFF - %s\n", statusMsg.c_str());
      }
    }


    relayWasActive = relayActive;

    Serial.printf("Czas snu: %lu sekund\n", sleepDuration);

    // === WYSYŁANIE DANYCH MQTT ===
    char buffer[512];
    JsonDocument doc;
    doc["moisture_level"] = moisture_level;
    doc["moisture_raw"] = moisture_raw_value;
    doc["water_level"] = water_level;
    doc["relay_state"] = relayActive ? 1 : 0;
    doc["status"] = statusMsg;
    doc["uptime"] = currentTime / 1000;
    doc["moisture_thresholds"]["low"] = moistureLowThreshold;
    doc["moisture_thresholds"]["high"] = moistureHighThreshold;
    
    if (relayActive) {
      doc["watering_time"] = (currentTime - wateringStartTime) / 1000;
    }
    if (lastWateringEnd > 0) {
      doc["time_since_last_watering"] = (currentTime - lastWateringEnd) / 1000;
    }

    size_t n = serializeJson(doc, buffer);
    client.publish(mqtt_topic, buffer, n);


    delay(sleepDuration * 1000);
  }
}
