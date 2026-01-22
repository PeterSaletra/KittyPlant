#ifndef WIFI_HELPER_H
#define WIFI_HELPER_H
#include <WiFi.h>
#include "wifi_portal.h"
#include "helpers.h"
#include "nvs_helper.h"

void setup_wifi();
void reconnect_wifi();

#endif // WIFI_HELPER_H