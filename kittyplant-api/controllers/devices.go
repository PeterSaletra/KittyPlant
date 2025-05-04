package controllers

import (
	"kittyplant-api/store"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type NewDevice struct {
	DeviceID      string `json:"device_id" binding:"required"`
	Name          string `json:"name" binding:"required"`
	Plant         string `json:"plant" binding:"required"`
	WaterLevelMin *int   `json:"water_level_min", omitempty"`
	WaterLevelMax *int   `json:"water_level_max", omitempty"`
}

func (c *Controllers) GetDevices(ctx *gin.Context) {
	// var devices []store.Device
	// err := c.DB.GetDevicesAndWaterLevels(&devices)
	// if err != nil {
	// 	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch devices"})
	// 	return
	// }

	// log.Printf("Fetched devices: %v", devices)

	ctx.JSON(http.StatusOK, gin.H{
		"devices": []map[string]interface{}{
			{
				"name":       "device1",
				"status":     "online",
				"plant":      "plant1",
				"waterLevel": 80,
			},
			{
				"name":       "device2",
				"status":     "online",
				"plant":      "plant1",
				"waterLevel": 60,
			},
			{
				"name":       "device3",
				"status":     "online",
				"plant":      "plant1",
				"waterLevel": 20,
			},
			{
				"name":       "device4",
				"status":     "online",
				"plant":      "plant1",
				"waterLevel": 40,
			},
			{
				"name":       "device5",
				"status":     "online",
				"plant":      "plant1",
				"waterLevel": 0,
			},
		},
	})
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

	device := store.Device{
		DeviceName: newDevice.DeviceID,
	}

	err = c.DB.AddDevice(newDevice.DeviceID, &device)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add device"})
		return
	}

	if newDevice.WaterLevelMin != nil && newDevice.WaterLevelMax != nil {
		plant := store.Plant{
			Name:        newDevice.Plant,
			MinHydLevel: *newDevice.WaterLevelMin,
			MaxHydLevel: *newDevice.WaterLevelMax,
			Devices:     []store.Device{device},
		}

		err = c.DB.AddPlant(&plant)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add plant"})
			return
		}

	} else {
		err = c.DB.AssignDeviceToPlant(newDevice.Plant, &device)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to assign device to plant"})
			return
		}
	}

	err = c.DB.AssignDeviceToUser(userdb.ID, device.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to assign device to user"})
		return
	}

	c.mqtt.Subscribe(newDevice.DeviceID + "/data")

	ctx.JSON(http.StatusOK, gin.H{"message": "Device added successfully"})
}
