#ifndef CONFIG_H
#define CONFIG_H// GPIO pin definitions

#define PIN_RED    25 // GPIO25
#define PIN_GREEN  26 // GPIO26
#define PIN_BLUE   27 // GPIO27
#define PIN_SENSOR A0 // SVP
#define PIN_RELAY  26 // SVN

#define WSENSOR_HIGH_ADDR   0x78
#define WSENSOR_LOW_ADDR    0x77

#define WSENSOR_NO_TOUCH    0xFE
#define WSENSOR_THRESHOLD   100

#define SLEEP_DURATION_SEC 5
#define uS_TO_S_FACTOR 1000000ULL

// === KALIBRACJA CZUJNIKA WILGOTNOŚCI ===
#define ADC_DRY 3200           // Wartość ADC w suchej ziemi (kalibruj!)
#define ADC_WET 1200           // Wartość ADC w mokrej ziemi (kalibruj!)
#define ADC_MIN_VALID 800      // Poniżej = sensor w wodzie/zwarcie
#define ADC_MAX_VALID 3800     // Powyżej = sensor odpięty

// === HISTEREZA WILGOTNOŚCI (wartości domyślne) ===
#define MOISTURE_LOW_THRESHOLD_DEFAULT 30    // Włącz podlewanie
#define MOISTURE_HIGH_THRESHOLD_DEFAULT 60   // Wyłącz podlewanie

// === HISTEREZA POZIOMU WODY ===
#define WATER_LOW_THRESHOLD 15       // Wyłącz przy niskim poziomie
#define WATER_SAFE_THRESHOLD 25      // Włącz przy bezpiecznym poziomie

// === TIMING I BEZPIECZEŃSTWO ===
#define MAX_WATERING_TIME 30000         // Max 30s podlewania (ms)
#define MIN_CYCLE_INTERVAL 180000       // Min 3min między cyklami (ms)
#define COOLDOWN_AFTER_WATERING 300000  // 5min cooldown po podlewaniu (ms)
#define MAX_ERROR_COUNT 5               // Max liczba kolejnych błędów przed restartem

// MQTT client
static const char* hostname = "kp-0001";
static const char* mqtt_topic = "kp-0001/data";
static const char* mqtt_setup_topic = "kp-0001/setup";


// WiFi credentials
static const char* ssidAP = "Test";
static const char* passwordAP = "testtest";

//MQTT server
static const char* mqtt_server = "192.168.1.103";
static const int port = 1883;
#endif