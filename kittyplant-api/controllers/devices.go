package controllers

import (
	"encoding/json"
	"fmt"
	"kittyplant-api/store"
	"log"
	"net/http"
	"time"

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

		deviceData, err := c.cache.Get(redisKey)

		var waterLevel int
		var moistureLevel int
		var lastTimeWatered string
		if err != nil {

			log.Printf("%s", err.Error())
			waterLevel = 0
		} else {

			redisData := make(map[string]interface{})

			if err := json.Unmarshal([]byte(deviceData), &redisData); err != nil {
				log.Printf("Failed to unmarshal Redis data: %s", err)
			} else {
				if wl, ok := redisData["water_level"].(float64); ok {
					waterLevel = int(wl)
				}
				if ml, ok := redisData["moisture"].(float64); ok {
					moistureLevel = int(ml)
				}
				if lw, ok := redisData["last_watered_str"].(string); ok {
					lastTimeWatered = lw
				}
			}

		}

		devices = append(devices, map[string]interface{}{
			"name":            device.DeviceName,
			"status":          "online",
			"plant":           device.Plant.Name,
			"waterLevel":      waterLevel,
			"moistureLevel":   moistureLevel,
			"lastTimeWatered": lastTimeWatered,
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

	err = c.cache.CreateTimeSeries(newDevice.DeviceID+":water", "0", map[string]string{
		"device": newDevice.DeviceID,
		"type":   "water",
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create device timeseries"})
		return
	}
	err = c.cache.CreateTimeSeries(newDevice.DeviceID+":moisture", "0", map[string]string{
		"device": newDevice.DeviceID,
		"type":   "moisture",
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create device timeseries"})
		return
	}

	c.mqtt.Subscribe(newDevice.DeviceID + "/data")

	ctx.JSON(http.StatusOK, gin.H{"message": "Device added successfully"})
}

func (c *Controllers) GetDeviceData(ctx *gin.Context) {
	session := sessions.Default(ctx)

	userID := session.Get(userIDSessionKey)
	if userID == nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	deviceID := ctx.Query("device_id")
	startStr := ctx.Query("start")
	endStr := ctx.Query("end")
	rangeType := ctx.Query("range")

	belongs, err := c.DB.CheckDeviceBelongsToUser(userID.(uint), deviceID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to veryfie device"})
		return
	}

	if !belongs {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "This device does not belong to you"})
		return
	}

	start, err := time.Parse(time.RFC3339, startStr)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Unavble to parse start time"})
		return
	}

	end, err := time.Parse(time.RFC3339, endStr)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Unavble to parse start time"})
		return
	}

	var aggregation string = "avg"
	var bucketDuration int64

	switch rangeType {
	case "day":
		bucketDuration = 60 * 60 * 1000 // 1 hour in milliseconds
	case "week":
		bucketDuration = 24 * 60 * 60 * 1000 // 1 day in milliseconds
	case "month":
		bucketDuration = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds
	case "year":
		bucketDuration = 30 * 24 * 60 * 60 * 1000 // 1 month in milliseconds
	default:
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid range type"})
		return
	}

	filterWater := fmt.Sprintf("device=%s type=%s", deviceID, "water")
	filterMoisture := fmt.Sprintf("device=%s type=%s", deviceID, "moisture")

	dataWater, err := c.cache.GetMultiTimeSeriesRange(filterWater, start.UnixMilli(), end.UnixMilli(), aggregation, bucketDuration)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get water data"})
		return
	}

	dataMoisture, err := c.cache.GetMultiTimeSeriesRange(filterMoisture, start.UnixMilli(), end.UnixMilli(), aggregation, bucketDuration)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get moisture data"})
		return
	}

	// TOOD: Process data to a more friendly format

	ctx.JSON(http.StatusOK, gin.H{
		"water_data":    dataWater,
		"moisture_data": dataMoisture,
	})
}
