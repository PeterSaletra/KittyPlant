#ifndef WIFI_PORTAL_H
#define WIFI_PORTAL_H

#include <WebServer.h>
#include <DNSServer.h>
#include "web_page.h"
#include "helpers.h"
#include "nvs_helper.h"
#include "spiffs_helper.h"

void run_wifi_portal();

#endif // WIFI_PORTAL_H