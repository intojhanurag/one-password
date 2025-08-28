package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv        string
	Port          string
	DatabaseURL   string
	JWTSecret     string
	JWTExpiresMin int
	BCryptCost    int
}

func Load() *Config {
	_ = godotenv.Load()

	jwtExp, err := strconv.Atoi(get("JWT_EXPIRES_MIN", "60"))
	if err != nil { jwtExp = 60 }

	bcryptCost, err := strconv.Atoi(get("BCRYPT_COST", "12"))
	if err != nil { bcryptCost = 12 }

	return &Config{
		AppEnv:        get("APP_ENV", "dev"),
		Port:          get("PORT", "8080"),
		DatabaseURL:   must("DATABASE_URL"),
		JWTSecret:     must("JWT_SECRET"),
		JWTExpiresMin: jwtExp,
		BCryptCost:    bcryptCost,
	}
}

func get(key, def string) string {
	if v := os.Getenv(key); v != "" { return v }
	return def
}

func must(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("missing required env: %s", key)
	}
	return v
}
