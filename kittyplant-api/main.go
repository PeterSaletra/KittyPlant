package main

import (
	"kittyplant-api/config"
	"kittyplant-api/controllers"
	"kittyplant-api/mqtt"
	"kittyplant-api/store"
	"kittyplant-api/transport"
	"log"

	"github.com/redis/go-redis/v9"
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
	redis := redis.NewClient(&redis.Options{
		Addr: config.AppConfig.RedisAddr,
	})
	mqtt, err := mqtt.NewMqttClient(config.AppConfig.Broker, redis)
	if err != nil {
		log.Fatalf("Cannot connect to mqtt broker: %s\n", err)
	}
	ctrl := controllers.NewControllers(db, redis, mqtt)

	http := transport.NewHttpServer(db, ctrl)
	http.PrepareServer()

	http.Serve()
}
