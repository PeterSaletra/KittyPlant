package controllers

import (
	"kittyplant-api/mqtt"
	"kittyplant-api/store"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type Controllers struct {
	DB    *store.Database
	mqtt  *mqtt.MqttClient
	redis *redis.Client
}

func NewControllers(db *store.Database, redis *redis.Client, mqtt *mqtt.MqttClient) *Controllers {
	return &Controllers{
		DB:    db,
		mqtt:  mqtt,
		redis: redis,
	}
}

func (c *Controllers) HealthCheck(ctx *gin.Context) {
	ctx.JSON(200, gin.H{"status": "ok"})
}
