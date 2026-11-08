package store

import (
	"fmt"
	"kittyplant-api/config"
	"log"
	"net"
	"net/url"

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
	cfg := config.AppConfig
	dsn := url.URL{
		Scheme:  "postgres",
		User:    url.UserPassword(cfg.DbUser, cfg.DbPass),
		Host:    net.JoinHostPort(cfg.DbHost, cfg.DbPort),
		Path:    "/" + cfg.DbName,
		RawPath: "/" + url.PathEscape(cfg.DbName),
	}
	params := url.Values{
		"sslmode":  {"disable"},
		"TimeZone": {"Europe/Warsaw"},
	}
	if cfg.DbTLSCA != "" {
		params.Set("sslmode", "verify-full")
		params.Set("sslrootcert", cfg.DbTLSCA)
	}
	dsn.RawQuery = params.Encode()

	db, err := gorm.Open(postgres.Open(dsn.String()), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("gorm.Open: %s", err)
	}
	d.DB = db

	return nil
}

func (d *Database) Migrate() error {
	err := d.DB.AutoMigrate(&User{})
	if err != nil {
		log.Fatalf("Cannot migrate table Users: %s", err)
	}
	fmt.Print("Users table migrated\n")
	err = d.DB.AutoMigrate(&Plant{})
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
	err = d.DB.AutoMigrate(&Device{})
	if err != nil {
		log.Fatalf("Cannot migrate table Devices: %s", err)
	}
	fmt.Print("Devices table migrated\n")
	err = d.DB.AutoMigrate(&Relation{})
	if err != nil {
		log.Fatalf("Cannot migrate table Relations: %s", err)
	}
	fmt.Print("Relations table migrated\n")
	return nil
}
