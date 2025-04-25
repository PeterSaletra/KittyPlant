package controllers

import (
	"kittyplant-api/store"

	"github.com/gin-gonic/gin"
)

type Controllers struct {
	DB *store.Database
}

func NewControllers(db *store.Database) *Controllers {
	return &Controllers{
		DB: db,
	}
}

func (c *Controllers) HealthCheck(ctx *gin.Context) {
	ctx.JSON(200, gin.H{"status": "ok"})
}
