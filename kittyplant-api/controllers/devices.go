package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type NewDevice struct {
	DeviceID      string `json:"device_id" binding:"required"`
	Name          string `json:"name" binding:"required"`
	Plant         string `json:"plant" binding:"required"`
	WaterLevelMax int    `json:"water_level_max" binding:"required"`
	WaterLevelMin int    `json:"water_level_min" binding:"required"`
	Status        string `json:"status" binding:"required"`
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
	var newDevice NewDevice
	if err := ctx.ShouldBindJSON(&newDevice); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// device := store.Device{}

	// err := c.DB.AddNewDevice(&device)
	// if err != nil {
	// 	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add device"})
	// 	return
	// }

	ctx.JSON(http.StatusOK, gin.H{"message": "Device added successfully"})

}
