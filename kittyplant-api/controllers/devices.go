package controllers

import (
	"encoding/json"
	"kittyplant-api/store"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type NewDevice struct {
	DeviceID      string `json:"device_id" binding:"required"`
	Name          string `json:"name" binding:"required"`
	Plant         string `json:"plant" binding:"required"`
	WaterLevelMin *int   `json:"water_level_min,omitempty"`
	WaterLevelMax *int   `json:"water_level_max,omitempty"`
}

func (c *Controllers) GetDevices(ctx *gin.Context) {
	session := sessions.Default(ctx)

	user := session.Get(userSessionKey)
	if user == nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	var userdb store.User
	err := c.DB.GetUserByName(&userdb, user.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	var devicesdb []store.Device
	err = c.DB.GetDevicesAssignedToUser(&devicesdb, userdb.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user devices"})
	}

	var devices []map[string]interface{}

	for _, device := range devicesdb {
		redisKey := device.DeviceName + "/data"

		deviceData, err := c.redis.Get(ctx, redisKey).Result()

		var waterLevel int
		if err != nil {

			log.Printf(err.Error())
			waterLevel = 0
		} else {

			var redisData map[string]interface{}
			redisData = make(map[string]interface{})

			if err := json.Unmarshal([]byte(deviceData), &redisData); err != nil {
				log.Printf("Failed to unmarshal Redis data: %s", err)
			} else {
				if wl, ok := redisData["water_level"].(float64); ok {
					waterLevel = int(wl)
				}
			}

		}

		devices = append(devices, map[string]interface{}{
			"name":       device.DeviceName,
			"status":     "online",
			"plant":      device.Plant.Name,
			"waterLevel": waterLevel,
		})
	}

	ctx.JSON(http.StatusOK, gin.H{"devices": devices})
}

func (c *Controllers) AddNewDevice(ctx *gin.Context) {
	session := sessions.Default(ctx)

	var newDevice NewDevice
	if err := ctx.ShouldBindJSON(&newDevice); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := session.Get(userSessionKey)
	if user == nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	var userdb store.User
	err := c.DB.GetUserByName(&userdb, user.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	var plant store.Plant
	err = c.DB.GetPlant(&plant, newDevice.Plant)
	if err != nil {
		if err == gorm.ErrRecordNotFound {

			if newDevice.WaterLevelMin != nil && newDevice.WaterLevelMax != nil {
				plant = store.Plant{
					Name:        newDevice.Plant,
					MinHydLevel: *newDevice.WaterLevelMin,
					MaxHydLevel: *newDevice.WaterLevelMax,
				}

				err = c.DB.AddPlant(&plant)
				if err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add plant"})
					return
				}
			} else {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Plant does not exist and water levels are not provided"})
				return
			}
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch plant"})
			return
		}
	}

	device := store.Device{
		DeviceName: newDevice.DeviceID,
		Name:       newDevice.Name,
		PlantID:    plant.ID,
		Plant:      plant,
	}

	err = c.DB.AddDevice(newDevice.DeviceID, &device)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add device"})
		return
	}

	err = c.DB.AssignDeviceToUser(userdb.ID, device.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to assign device to user"})
		return
	}

	c.mqtt.Subscribe(newDevice.DeviceID + "/data")

	ctx.JSON(http.StatusOK, gin.H{"message": "Device added successfully"})
}
