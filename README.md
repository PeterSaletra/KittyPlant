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
- [ ] Profile page
- [ ] Charts for analyze
- [ ] Checking the insolation
- [ ] Automatic watering system
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
    - CSS3

- ESP32
    - Arduino Framework
    - C++
    - [PlatformIO](https://platformio.org/)

## Setup

```
git clone https://github.com/PeterSaletra/KittyPlant.git
```

#### Backend setup

```
cd kittyplant-api
go run main.go
```

or 

```
cd kittyplant-api
go build
./kittyplant-api.exe
```

#### Database

```
docker run --name kittyplant_db -e POSTGRES_USER=kitty -e POSTGRES_PASSWORD=password -e POSTGRES_DB=kittyplant_db -p 5432:5432 -d postgres
```

#### Mqtt broker

```
 mosquitto_passwd -c conf/mosquitto/passwd_file username
t
```

#### Frontend setup

```
cd kiityplant-app
npm install
npm run dev
```

#### ESP32

Connect all hardware componets to esp32 board as on [Electronic Circuit Design](#electronic-circuit-design).

Program your esp32 board. We suggest to use platformIO as extension to VS Code.

<p align="center" width="100%">
<img src="/img/kittymain.png" alt="kittymain"/>
</p>
