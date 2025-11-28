#ifndef NVS_HELPER_H
#define NVS_HELPER_H

#include <Preferences.h>
#include "nvs_flash.h"

Preferences preferences;

void init_nvs();
void init_preferences(const char* namespace_name);
void close_preferences();
void set_value_bool(const char* key, bool value);
void set_value_string(const char* key, String value);
String get_value_string(const char* key, const char* default_value = "");

#endif // NVS_HELPER_H