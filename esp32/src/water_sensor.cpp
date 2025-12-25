#include "water_sensor.h"

void getHigh12SectionValue(unsigned char* high_data){
  memset(high_data, 0, sizeof(high_data));
  Wire.requestFrom(WSENSOR_HIGH_ADDR, 12);
  while (12 != Wire.available());

  for (int i = 0; i < 12; i++) {
    high_data[i] = Wire.read();
  }
  delay(10);
}

void getLow8SectionValue(unsigned char* low_data){
  memset(low_data, 0, sizeof(low_data));
  Wire.requestFrom(WSENSOR_LOW_ADDR, 8);
  while (8 != Wire.available());

  for (int i = 0; i < 8 ; i++) {
    low_data[i] = Wire.read(); // receive a byte as character
  }
  delay(10);
}   