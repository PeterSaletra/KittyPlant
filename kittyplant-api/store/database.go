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
	// Migrate tables in the correct order to satisfy foreign key dependencies
	err := d.DB.AutoMigrate(&User{}) // Users table must be created first
	if err != nil {
		log.Fatalf("Cannot migrate table Users: %s", err)
	}
	fmt.Print("Users table migrated\n")
	err = d.DB.AutoMigrate(&Plant{}) // Plants table can be created independently
	if err != nil {
		log.Fatalf("Cannot migrate table Plants: %s", err)
	}

	initialPlants := []Plant{
		{Name: "Alokazja", MinHydLevel: 40, MaxHydLevel: 65},
		{Name: "Aloes Zwyczajny", MinHydLevel: 5, MaxHydLevel: 20},
		{Name: "Chamedora Wytworna", MinHydLevel: 35, MaxHydLevel: 60},
		{Name: "Figowiec Dębolistny", MinHydLevel: 45, MaxHydLevel: 70},
		{Name: "Figowiec Sprężysty", MinHydLevel: 30, MaxHydLevel: 55},
		{Name: "Haworsja", MinHydLevel: 15, MaxHydLevel: 40},
		{Name: "Monstera Dziurawa", MinHydLevel: 30, MaxHydLevel: 55},
		{Name: "Monstera Perforowana", MinHydLevel: 30, MaxHydLevel: 55},
		{Name: "Sansewieria Gwinejska", MinHydLevel: 5, MaxHydLevel: 25},
		{Name: "Skrzydłokwiat", MinHydLevel: 50, MaxHydLevel: 75},
		{Name: "Zamiokulkas Zamiolistny", MinHydLevel: 10, MaxHydLevel: 30},
		{Name: "Begonia Koralowa", MinHydLevel: 35, MaxHydLevel: 60},
	}

	for _, plant := range initialPlants {
		if err := d.DB.FirstOrCreate(&plant, Plant{Name: plant.Name}).Error; err != nil {
			log.Fatalf("Cannot insert initial data into Plants table: %s", err)
		}
	}
	fmt.Print("Initial data inserted into Plants table\n")

	fmt.Print("Plants table migrated\n")
	err = d.DB.AutoMigrate(&Device{}) // Devices table must be created before Data and Relations
	if err != nil {
		log.Fatalf("Cannot migrate table Devices: %s", err)
	}
	fmt.Print("Devices table migrated\n")
	err = d.DB.AutoMigrate(&Data{}) // Data table depends on Devices
	if err != nil {
		log.Fatalf("Cannot migrate table Data: %s", err)
	}
	fmt.Print("Data table migrated\n")
	err = d.DB.AutoMigrate(&Relation{}) // Relations table depends on Users and Devices
	if err != nil {
		log.Fatalf("Cannot migrate table Relations: %s", err)
	}
	fmt.Print("Relations table migrated\n")
	return nil
}
