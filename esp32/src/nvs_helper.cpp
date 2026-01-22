#include "nvs_helper.h"

static Preferences preferences;

void init_nvs() {
    esp_err_t err = nvs_flash_init();
    if (err == ESP_ERR_NVS_NO_FREE_PAGES || err == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        err = nvs_flash_init();
    }
    ESP_ERROR_CHECK(err);
}

void init_preferences(const char* namespace_name) {
    preferences.begin(namespace_name, false);
}

void close_preferences() {
    preferences.end();
}

void set_value_bool(const char* key, bool value) {
    preferences.putBool(key, value);
}

void set_value_string(const char* key, String value) {
    if (value.length() == 0) {
        return;
    }
    preferences.putString(key, value);
}

String get_value_string(const char* key, const char* default_value) {
    String value = preferences.getString(key, String(default_value));
    if (value.length() == 0) {
        value = String(default_value);
    }
    return value;
}