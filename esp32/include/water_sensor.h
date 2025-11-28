#include <Wire.h>
#include <Arduino.h>
#include "config.h"

unsigned char low_data[8] = {0};
unsigned char high_data[12] = {0};

void getHigh12SectionValue(unsigned char* high_data);
void getLow8SectionValue(unsigned char* low_data);

inline int8_t get_water_level(){
  unsigned char low_data[8] = {0};
  unsigned char high_data[12] = {0};
  int sensorvalue_min = 250;
  int sensorvalue_max = 255;
  int low_count = 0;
  int high_count = 0;

  uint32_t touch_val = 0;
  uint8_t trig_section = 0;
  getLow8SectionValue(low_data);
  getHigh12SectionValue(high_data);

  for (int i = 0 ; i < 8; i++) {
      if (low_data[i] > WSENSOR_THRESHOLD) {
        touch_val |= 1 << i;
      }
  }
  for (int i = 0 ; i < 12; i++) {
      if (high_data[i] > WSENSOR_THRESHOLD) {
        touch_val |= (uint32_t)1 << (8 + i);
      }
  }

  while (touch_val & 0x01){
      trig_section++;
      touch_val >>= 1;
  }

  return trig_section * 5;
}