package controllers

import (
	"kittyplant-api/store"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

const userSessionKey = "username"

type AuthReq struct {
	User     string `form:"user" json:"user" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

func (c *Controllers) Login(ctx *gin.Context) {
	session := sessions.Default(ctx)

	var json AuthReq
	if err := ctx.ShouldBindJSON(&json); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// var user store.User
	// err := c.DB.GetUserByName(&user, json.User)
	// if err != nil {
	// 	ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
	// 	return
	// }

	// if !utils.VerifyPasswordHash(json.Password, user.Password) {
	// 	ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
	// 	return
	// }

	if json.User != "admin" && json.Password != "password" {
		ctx.JSON(http.StatusForbidden, gin.H{"erorr": "unauthorized"})
	}

	session.Set(userSessionKey, json.User)
	if err := session.Save(); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"user": json.User})

	// ctx.JSON(http.StatusOK, gin.H{"user": user.Name})
}

func (c *Controllers) Register(ctx *gin.Context) {
	var json AuthReq
	if err := ctx.ShouldBindJSON(&json); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	passwdHash, err := bcrypt.GenerateFromPassword([]byte(json.Password), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user := store.User{
		Name:     json.User,
		Password: string(passwdHash),
	}
	err = c.DB.CreateUser(&user)
	if err != nil {
		ctx.Status(http.StatusNotFound)
	} else {
		ctx.JSON(http.StatusOK, gin.H{"user": user.Name})
	}
}

func (c *Controllers) AuthRequired(ctx *gin.Context) {
	session := sessions.Default(ctx)

	if user := session.Get(userSessionKey); user == nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
}
