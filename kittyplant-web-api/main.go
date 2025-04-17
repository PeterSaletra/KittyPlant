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

	router.Run()
}
