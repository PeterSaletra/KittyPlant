package transport

import (
	"context"
	"fmt"
	"kittyplant-api/config"
	"kittyplant-api/controllers"
	"kittyplant-api/store"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type HttpServer struct {
	router *gin.Engine
	db *store.Database
	c  *controllers.Controllers
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
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))
	h.router = r
	h.prepareRoutes()
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
