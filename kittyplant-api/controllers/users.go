package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"kittyplant-api/store"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type UserResponse struct {
	ID           uint      `json:"id"`
	Username     string    `json:"username"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DevicesCount int64     `json:"devices_count"`
}

func (c *Controllers) GetUser(ctx *gin.Context) {
	session := sessions.Default(ctx)
	userID := session.Get("user_id")

	if userID == nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	cacheKey := fmt.Sprintf("user:%v", userID)
	var user store.User

	cachedData, err := c.cache.Get(cacheKey)
	if err != nil {

		user, err = c.DB.GetUserByID(fmt.Sprintf("%v", userID))
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
			return
		}

		c.cache.SetObject(cacheKey, user, 2*time.Hour)
	} else {
		if err := json.Unmarshal([]byte(cachedData), &user); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal user cache"})
			return
		}
	}

	devicesCount, err := c.DB.GetDevicesCountAssignedToUserID(user.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user devices count"})
		return
	}

	response := UserResponse{
		ID:           user.ID,
		Username:     user.Name,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
		DevicesCount: devicesCount,
	}

	ctx.JSON(http.StatusOK, response)
}
