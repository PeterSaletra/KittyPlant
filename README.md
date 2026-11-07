![logo](/kittyplant-app/src/assets/kittyplant-logo.png)

<p align="center" width="100%">
<img src="https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white" alt="Golang Badge"/> <img src="https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++ Badge"/> <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres Badge"/> <img src="https://img.shields.io/badge/ESP32-informational?style=for-the-badge&logo=Arduino&logoColor=white&color=00979D" alt="ESP32 Badge"/> <img src="https://img.shields.io/badge/-React-45b8d8?style=for-the-badge&logo=react&logoColor=white" alt="React Badge"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white" alt="Vite Badge"/>
</p>

KittyPlant is an IoT project created as university assigment to help you keep your plants in good condition :muscle:

## Table of contents
* [General info](#general-info)
* [Electronic Circuit Design](#electronic-circuit-design)
* [Technologies](#technologies)
* [Setup](#setup)

## General info

KittyPlant is an IoT project created to take care of your lovely plants :heart: with silly cats theme :cat:
The system uses a soil moisture sensor to monitor the moisture levels in the soil and provides real-time feedback to users.

This project combines hardware and software components to create a seamless experience for plant care. Built on ESP32 DevKit for cheap and fast development. It is designed to be user-friendly, customizable, and suitable for a variety of plant types. Whether you're a beginner or an experienced gardener, KittyPlant helps you take better care of your plants with minimal effort.

<p align="center" width="100%">
<img src="/img/kittyandplant.png" alt="kittyandplant"/>
</p>

#### Features
- Login/Register User
- Add new device
- Add custom plant to database
- Real-time data from you sensor
- Multiple device compatibility

#### Future Plans:
- [x] Profile page
- [x] Charts for analyze
- [x] Checking the insolation
- [x] Automatic watering system
- [ ] 3D Components to assemble



## Electronic Circuit Design

![circuit_img](/img/hardware_design.png)

## Technologies

- Backend
    - [Go v1.24.0](https://go.dev/)
    - [Gin](https://gin-gonic.com/)
    - [Gorm](https://gorm.io/)
    - [Phao MQTT](https://github.com/eclipse-paho/paho.mqtt.golang)

- Frontend
    - [React](https://react.dev/) + [Vite](https://vite.dev/)
    - [Tailwindcss](https://tailwindcss.com/)
    - [Shadnc](https://ui.shadcn.com/)

- ESP32
    - Arduino Framework
    - C++
    - [PlatformIO](https://platformio.org/)
    - [MQTTClient](https://github.com/256dpi/arduino-mqtt)
    - [ArduinoJson](https://arduinojson.org/)
 
 - Web Server
    - [Nginx](https://nginx.org/)

## Setup

On Linux, install Docker Engine with Compose v2, OpenSSL, curl and `flock` (from `util-linux`). The account running setup needs access to Docker. KittyPlant uses TCP ports 443 for HTTPS and 8883 for MQTT.

```bash
git clone https://github.com/PeterSaletra/KittyPlant.git
cd KittyPlant
bash setup.sh --host YOUR_SERVER_IP_OR_DNS_NAME
```

Use the IP address or DNS name that your browser and ESP32 use to reach the server. Setup generates `.env` and TLS certificates, builds both applications, starts Compose and checks the website and API over HTTPS. To trust the site in your browser, import the public `.data/tls/web-ca.crt` into your computer's trusted root certificate store and open the HTTPS address printed by setup.

Running setup again reuses the existing database, credentials and certificates. To start with an empty database and clear the Redis and Mosquitto volumes, use the reset mode and type `RESET` when prompted. This mode saves a private backup of the old `.env` under `.data/`, generates fresh credentials and keeps the generated certificates.

```bash
bash setup.sh --reset --host YOUR_SERVER_IP_OR_DNS_NAME
```

#### ESP32

Connect the hardware as shown in the [circuit design](#electronic-circuit-design). Set `mqtt_server` in `esp32/include/config.h` to the address used for `--host`. The firmware connects to port 8883.

Copy `ca.crt`, `kp-0001.crt` and `kp-0001.key` from the server's `.data/tls/esp32/` to `esp32/data/`. Upload the SPIFFS filesystem image and then the firmware using PlatformIO. Keep the device key private. An ESP32 provisioned with a previous CA needs the files from the new installation.

<p align="center" width="100%">
<img src="/img/kittymain.png" alt="kittymain"/>
</p>
