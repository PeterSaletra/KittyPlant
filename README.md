![logo](/kittyplant-app/src/assets/kittyplant-logo.png)

KittyPlant is an IoT project created as university assigment to help you keep your plants in good condition :muscle:

## Table of contents
* [General info](#general-info)
* [Electronic Circiut Design](#electronic-circiut-design)
* [Technologies](#technologies)
* [Setup](#setup)

## General info

KittyPlant is an IoT project created to take care of your lovely plants :heart: with silly cats theme :cat:
The system uses a soil moisture sensor to monitor the moisture levels in the soil and provides real-time feedback to users.

This project combines hardware and software components to create a seamless experience for plant care. Built on ESP32 DevKit for cheap and fast development. It is designed to be user-friendly, customizable, and suitable for a variety of plant types. Whether you're a beginner or an experienced gardener, KittyPlant helps you take better care of your plants with minimal effort.

<p align="center" width="100%">
<img src="/img/kittyandplant.png" alt="kittyandplant"/>
</p>

#### Feautures
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



## Electronic Circiut Design

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

#### Frontend setup

```
cd kiityplant-app
npm install
npm run dev
```

#### ESP32

Connect all hardware componets to esp32 board as on [Electronic Circiut Design](#electronic-circiut-design).

Program your esp32 board. We suggest to use platformIO as extension to VS Code.

<p align="center" width="100%">
<img src="/img/kittymain.png" alt="kittymain"/>
</p>