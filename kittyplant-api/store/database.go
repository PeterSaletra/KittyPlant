package store

import (
	"fmt"
	"kittyplant-api/config"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	DB *gorm.DB
}

func NewDatabase() *Database {
	return &Database{}
}

func (d *Database) Connect() error {
	dsn := fmt.Sprintf("host=%s "+
		"user=%s "+
		"password=%s "+
		"dbname=%s "+
		"port=%s "+
		"sslmode=disable "+
		"TimeZone=Europe/Warsaw",
		config.AppConfig.DbHost,
		config.AppConfig.DbUser,
		config.AppConfig.DbPass,
		config.AppConfig.DbName,
		config.AppConfig.DbPort)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("gorm.Open: %s", err)
	}
	d.DB = db

	return nil
}

func (d *Database) Migrate() error {
	err := d.DB.AutoMigrate(&User{}, &Device{}, &Plant{}, &Data{}, &Relation{})
	if err != nil {
		log.Fatalf("Cannot migrate table Users: %s", err)
	}
	return nil
}
