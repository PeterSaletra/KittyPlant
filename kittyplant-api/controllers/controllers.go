package controllers

import (
	"kittyplant-api/cache"
	"kittyplant-api/mqtt"
	"kittyplant-api/store"

	"github.com/gin-gonic/gin"
)

type Controllers struct {
	DB    *store.Database
	mqtt  *mqtt.MqttClient
	cache *cache.Cache
}

func NewControllers(db *store.Database, cache *cache.Cache, mqtt *mqtt.MqttClient) *Controllers {
	return &Controllers{
		DB:    db,
		mqtt:  mqtt,
		cache: cache,
	}
}

func (c *Controllers) HealthCheck(ctx *gin.Context) {
	ctx.JSON(200, gin.H{"status": "ok"})
}
