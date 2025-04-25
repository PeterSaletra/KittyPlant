package config

import (
	"fmt"

	"github.com/caarlos0/env"
	_ "github.com/joho/godotenv/autoload"
)

type Config struct {
	Port      string `env:"PORT,required"`
	JwtSecret string `env:"JWT_SECRET,required"`
	DbHost    string `env:"DB_HOST,required"`
	DbPort    string `env:"DB_PORT,required"`
	DbName    string `env:"DB_NAME,required"`
	DbUser    string `env:"DB_USER,required"`
	DbPass    string `env:"DB_PASS,required"`
	Broker    string `env:"BROKER,required"`
	RedisAddr string `env:"REDIS_ADDR,required"`
}

var AppConfig Config

func ParseConfig() error {
	if err := env.Parse(&AppConfig); err != nil {
		return fmt.Errorf("env.Parse: %s", err)
	}

	return nil
}
