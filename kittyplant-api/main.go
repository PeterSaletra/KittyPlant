package main

import (
	"kittyplant-api/config"
	"kittyplant-api/controllers"
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

	ctrl := controllers.NewControllers(db)

	http := transport.NewHttpServer(db, ctrl)
	http.PrepareServer()

	http.Serve()
}
