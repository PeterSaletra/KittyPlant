package config

import (
	"fmt"

	"github.com/caarlos0/env"
	_ "github.com/joho/godotenv/autoload"
)

type Config struct {
	Port          string `env:"PORT,required"`
	JwtSecret     string `env:"JWT_SECRET,required"`
	DbHost        string `env:"DB_HOST,required"`
	DbPort        string `env:"DB_PORT,required"`
	DbName        string `env:"DB_NAME,required"`
	DbUser        string `env:"DB_USER,required"`
	DbPass        string `env:"DB_PASS,required"`
	DbTLSCA       string `env:"DB_TLS_CA"`
	Broker        string `env:"BROKER,required"`
	RedisAddr     string `env:"REDIS_HOST,required"`
	RedisPassword string `env:"REDIS_PASSWORD"`
	RedisTLSDir   string `env:"REDIS_TLS_DIR"`
}

var AppConfig Config

func ParseConfig() error {
	if err := env.Parse(&AppConfig); err != nil {
		return fmt.Errorf("env.Parse: %s", err)
	}

	return nil
}
