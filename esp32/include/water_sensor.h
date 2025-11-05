#include <Wire.h>
#include <Arduino.h>
#include "config.h"

unsigned char low_data[8] = {0};
unsigned char high_data[12] = {0};

void getHigh12SectionValue(void){
  memset(high_data, 0, sizeof(high_data));
  Wire.requestFrom(WSENSOR_HIGH_ADDR, 12);
  while (12 != Wire.available());

  for (int i = 0; i < 12; i++) {
    high_data[i] = Wire.read();
  }
  delay(10);
}

void getLow8SectionValue(void){
  memset(low_data, 0, sizeof(low_data));
  Wire.requestFrom(WSENSOR_LOW_ADDR, 8);
  while (8 != Wire.available());

  for (int i = 0; i < 8 ; i++) {
    low_data[i] = Wire.read(); // receive a byte as character
  }
  delay(10);
}   

int8_t get_water_level(){
    int sensorvalue_min = 250;
    int sensorvalue_max = 255;
    int low_count = 0;
    int high_count = 0;

    uint32_t touch_val = 0;
    uint8_t trig_section = 0;
    getLow8SectionValue();
    getHigh12SectionValue();

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