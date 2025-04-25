package transport

import (
	"context"
	"fmt"
	"kittyplant-web-app/config"
	"kittyplant-web-app/controllers"
	"kittyplant-web-app/mqtt"
	"kittyplant-web-app/store"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-gonic/gin"
)

type HttpServer struct {
	router *gin.Engine
	mqtt   *mqtt.MqttClient
	db     *store.Database
	c      *controllers.Controllers
}

func NewHttpServer(database *store.Database, c *controllers.Controllers) *HttpServer {
	return &HttpServer{
		db: database,
		c:  c,
	}
}

func (h *HttpServer) PrepareServer() {
	r := gin.New()
	r.Use(gin.Logger())
	h.router = r
	h.prepareRoutes()
	h.mqtt = mqtt.NewMqttClient(config.AppConfig.Broker, config.AppConfig.RedisAddr)
}

func (h *HttpServer) Serve() {
	var wait time.Duration

	addr := fmt.Sprintf("0.0.0.0:%s", config.AppConfig.Port)
	srv := &http.Server{
		Addr:         addr,
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      h.router,
	}

	log.Printf("Server is running at %s\n", addr)
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Fatal(err)
		}
	}()
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	<-c

	ctx, cancel := context.WithTimeout(context.Background(), wait)
	defer cancel()

	srv.Shutdown(ctx)
	log.Println("server shutting down")
}
