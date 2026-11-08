package main

import (
	"context"
	"crypto/tls"
	"kittyplant-api/cache"
	"kittyplant-api/config"
	"kittyplant-api/controllers"
	"kittyplant-api/mqtt"
	"kittyplant-api/store"
	"kittyplant-api/transport"
	"kittyplant-api/utils"
	"log"
	"time"
)

func main() {
	err := config.ParseConfig()
	if err != nil {
		log.Fatalf("Cannot get config from env: %s\n", err)
	}

	db := store.NewDatabase()
	err = db.Connect()
	if err != nil {
		log.Fatalf("Cannot connect to database: %s\n", err)
	}
	err = db.Migrate()
	if err != nil {
		log.Fatalf("Cannot migrate database: %s\n", err)
	}
	cfg := config.AppConfig
	var redisTLS *tls.Config
	if cfg.RedisTLSDir != "" {
		redisTLS, err = utils.LoadClientTLS(cfg.RedisTLSDir)
		if err != nil {
			log.Fatalf("Cannot load Redis client TLS: %s", err)
		}
	}
	cache := cache.NewCache(cfg.RedisAddr, cfg.RedisPassword, redisTLS)
	if redisTLS != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		err := cache.Ping(ctx)
		cancel()
		if err != nil {
			log.Fatalf("Cannot connect to Redis: %s", err)
		}
	}
	mqtt, err := mqtt.NewMqttClient(cfg.Broker, cache)
	if err != nil {
		log.Fatalf("Cannot connect to mqtt broker: %s\n", err)
	}
	ctrl := controllers.NewControllers(db, cache, mqtt)

	http := transport.NewHttpServer(db, ctrl)
	http.PrepareServer()

	http.Serve()
}
