package controllers

import (
	"kittyplant-api/store"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (c *Controllers) GetPlants(ctx *gin.Context) {
	var plants []store.Plant

	err := c.DB.GetPlants(&plants)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	ctx.JSON(http.StatusOK, gin.H{
		"plants": []map[string]interface{}{
			{
				"name":        "Szczypiorek",
				"waterLevel":  80,
				"temperature": 22,
				"humidity":    60,
			},
			{
				"name":        "Bajaminek",
				"waterLevel":  60,
				"temperature": 20,
				"humidity":    55,
			},
			{
				"name":        "Kaktus",
				"waterLevel":  20,
				"temperature": 20,
				"humidity":    55,
			},
		},
	})
}
