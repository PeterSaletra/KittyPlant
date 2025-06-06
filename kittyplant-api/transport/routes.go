package transport

import (
	"kittyplant-api/config"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func (h *HttpServer) prepareRoutes() {
	h.router.Use(gin.Recovery())

	h.router.Use(sessions.Sessions("session",
		cookie.NewStore([]byte(config.AppConfig.JwtSecret)),
	))
	h.router.GET("/api/healthcheck", h.c.HealthCheck)

	auth := h.router.Group("/api/auth")
	{
		auth.POST("/register", h.c.Register)
		auth.POST("/login", h.c.Login)
		auth.POST("/logout", h.c.Logout)
	}

	api := h.router.Group("/api/v1")
	api.Use(h.c.AuthRequired)
	{
		devices := api.Group("/devices")
		{
			devices.GET("", h.c.GetDevices)
			devices.POST("", h.c.AddNewDevice)

		}
		plants := api.Group("/plants")
		{
			plants.GET("", h.c.GetPlants)
		}
	}
}
