package main

import (
	"kittyplant-api/cache"
	"kittyplant-api/config"
	"kittyplant-api/controllers"
	"kittyplant-api/mqtt"
	"kittyplant-api/store"
	"kittyplant-api/transport"
	"log"
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
	cache := cache.NewCache(config.AppConfig.RedisAddr, "")
	mqtt, err := mqtt.NewMqttClient(config.AppConfig.Broker, cache)
	if err != nil {
		log.Fatalf("Cannot connect to mqtt broker: %s\n", err)
	}
	ctrl := controllers.NewControllers(db, cache, mqtt)

	http := transport.NewHttpServer(db, ctrl)
	http.PrepareServer()

	http.Serve()
}
