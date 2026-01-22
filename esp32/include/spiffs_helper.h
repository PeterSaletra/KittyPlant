#ifndef SPIFFS_HELPER_H
#define SPIFFS_HELPER_H
#include <SPIFFS.h>
#include "config.h"

void init_spiffs();
String read_ca_cert();
String read_client_cert();
String read_client_key();

#endif // SPIFFS_HELPER_H