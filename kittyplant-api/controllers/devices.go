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
		log.Printf("Redis key: %s", redisKey)

		var waterLevel int
		var moistureLevel int
		var lastTimeWatered string

		deviceData, err := c.cache.GetObjectAll(redisKey)
		if err != nil {
			log.Printf("Failed to get data from cache for %s: %s", redisKey, err.Error())
			waterLevel = 0
			moistureLevel = 0
		} else {
			jsonData, err := json.Marshal(deviceData)
			if err != nil {
				log.Printf("Failed to marshal Redis data: %s", err)
			} else {
				log.Printf("Redis data: %s", string(jsonData))

				redisData := make(map[string]interface{})
				if err := json.Unmarshal(jsonData, &redisData); err != nil {
					log.Printf("Failed to unmarshal Redis data: %s", err)
				} else {
					if wl, ok := redisData["water_level"].(float64); ok {
						waterLevel = int(wl)
					}
					if ml, ok := redisData["moisture_level"].(float64); ok {
						moistureLevel = int(ml)
					}
					if lw, ok := redisData["last_watered_str"].(string); ok {
						lastTimeWatered = lw
					}
				}
			}
		}

		devices = append(devices, map[string]interface{}{
			"name":            device.DeviceName,
			"displayName":     device.Name,
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
		log.Printf("Failed to verify device ownership: %v", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to veryfie device"})
		return
	}

	if !belongs {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "This device does not belong to you"})
		return
	}

	start, err := time.Parse(time.RFC3339, startStr)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Unable to parse start time"})
		return
	}

	end, err := time.Parse(time.RFC3339, endStr)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Unable to parse end time"})
		return
	}

	log.Printf("Querying from %d to %d", start.UnixMilli(), end.UnixMilli())
	log.Printf("Querying from %d to %d", int(start.UnixMilli()), int(end.UnixMilli()))

	var aggregation string = "avg"
	var bucketDuration int

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

	log.Printf("Water data: %v", dataWater)
	log.Printf("Moisture data: %v", dataMoisture)

	combinedData := transformTimeSeriesData(dataWater, dataMoisture, rangeType)

	ctx.JSON(http.StatusOK, gin.H{
		"data": combinedData,
	})
}

func transformTimeSeriesData(waterData, moistureData interface{}, rangeType string) []map[string]interface{} {
	// Extract data points from the nested structure
	waterPoints := extractDataPoints(waterData)
	moisturePoints := extractDataPoints(moistureData)

	// Create map for quick lookup
	waterMap := make(map[int64]float64)
	for _, point := range waterPoints {
		waterMap[point.Timestamp] = point.Value
	}

	moistureMap := make(map[int64]float64)
	for _, point := range moisturePoints {
		moistureMap[point.Timestamp] = point.Value
	}

	// Get all unique timestamps
	timestampSet := make(map[int64]bool)
	for ts := range waterMap {
		timestampSet[ts] = true
	}
	for ts := range moistureMap {
		timestampSet[ts] = true
	}

	// Create sorted list of timestamps
	var timestamps []int64
	for ts := range timestampSet {
		timestamps = append(timestamps, ts)
	}

	// Sort timestamps
	for i := 0; i < len(timestamps); i++ {
		for j := i + 1; j < len(timestamps); j++ {
			if timestamps[i] > timestamps[j] {
				timestamps[i], timestamps[j] = timestamps[j], timestamps[i]
			}
		}
	}

	// Build combined result
	var result []map[string]interface{}
	for _, ts := range timestamps {
		timeStr := formatTimestamp(ts, rangeType)
		water := 0
		moisture := 0

		if val, ok := waterMap[ts]; ok {
			water = int(val)
		}
		if val, ok := moistureMap[ts]; ok {
			moisture = int(val)
		}

		result = append(result, map[string]interface{}{
			"time":     timeStr,
			"moisture": moisture,
			"water":    water,
		})
	}

	return result
}

type DataPoint struct {
	Timestamp int64
	Value     float64
}

func extractDataPoints(data interface{}) []DataPoint {
	var points []DataPoint

	// Debug: log the actual type
	log.Printf("Data type: %T", data)

	// Convert to JSON and back to normalize the type
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Printf("Failed to marshal data: %v", err)
		return points
	}

	log.Printf("JSON data: %s", string(jsonData))

	var dataMap map[string]interface{}
	if err := json.Unmarshal(jsonData, &dataMap); err != nil {
		log.Printf("Failed to unmarshal data: %v", err)
		return points
	}

	// Get the first (and should be only) value from the map
	for key, value := range dataMap {
		log.Printf("Processing series key: %s", key)

		arr, ok := value.([]interface{})
		if !ok {
			log.Printf("Failed to cast value to []interface{}")
			continue
		}

		if len(arr) < 3 {
			log.Printf("Array too short, length: %d", len(arr))
			continue
		}

		// The actual data is in the third element
		dataArr, ok := arr[2].([]interface{})
		if !ok {
			log.Printf("Failed to cast arr[2] to []interface{}")
			continue
		}

		for _, item := range dataArr {
			pair, ok := item.([]interface{})
			if !ok || len(pair) != 2 {
				continue
			}

			timestamp, ok := pair[0].(float64)
			if !ok {
				continue
			}

			value, ok := pair[1].(float64)
			if !ok {
				continue
			}

			points = append(points, DataPoint{
				Timestamp: int64(timestamp),
				Value:     value,
			})
		}

		log.Printf("Extracted %d points from series %s", len(points), key)
		break // Only process first series
	}

	return points
}

func formatTimestamp(timestampMs int64, rangeType string) string {
	t := time.UnixMilli(timestampMs)

	switch rangeType {
	case "day":
		return t.Format("15:04") // "00:00"
	case "week":
		return t.Format("Mon 02") // "Mon 12"
	case "month":
		return t.Format("Jan 2") // "Dec 5"
	case "year":
		return t.Format("Jan") // "Jan"
	default:
		return t.Format("15:04")
	}
}
