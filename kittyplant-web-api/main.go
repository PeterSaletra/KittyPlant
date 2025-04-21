package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Auth struct {
	Username string `from:"username" json:"username" binding:"required"`
	Password string `from:"password" json:"password" binding:"required"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not set
	}
	log.Printf("Starting server on port %s", port)
	log.Print("Serve http://0.0.0.0:" + port)
	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(cors.Default())

	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
	router.POST("/api/auth/login", func(c *gin.Context) {
		var json Auth
		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		fmt.Println(json.Username, json.Password)
		if json.Username == "admin" && json.Password == "password" {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		} else {
			c.JSON(http.StatusForbidden, gin.H{"status": "unauthorized"})
		}
	})

	router.GET("/api/devices", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
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
	})

	router.GET("/api/plants", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
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
			},
		})
	})

	router.Run()
}
