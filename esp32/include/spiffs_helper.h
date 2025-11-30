#ifndef SPIFFS_HELPER_H
#define SPIFFS_HELPER_H
#include <SPIFFS.h>

void init_spiffs();
String read_index_html();
String ready_connection_html();
String read_ca_cert();
String read_client_cert();
String read_client_key();

#endif // SPIFFS_HELPER_H