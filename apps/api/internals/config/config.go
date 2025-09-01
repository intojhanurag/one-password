package config

import (
	"log"
	"os"
	"strconv"
	"encoding/base64"
	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv        string
	Port          string
	DatabaseURL   string
	JWTSecret     string
	JWTExpiresMin int
	BCryptCost    int
	MasterKey     []byte
}

func Load() *Config {
	_ = godotenv.Load()

	jwtExp, err := strconv.Atoi(get("JWT_EXPIRES_MIN", "60"))
	if err != nil { jwtExp = 60 }

	bcryptCost, err := strconv.Atoi(get("BCRYPT_COST", "12"))
	if err != nil { bcryptCost = 12 }

	masterKeyB64:=must("MASTER_KEY_B64")

	keyBytes, err:=base64.StdEncoding.DecodeString(masterKeyB64)

	if err!=nil {
		log.Fatalf("invalid MASTER_KEY_B64: %v",err)
	}

	if len(keyBytes)!=32 {
		log.Fatalf("MASTER_KEY_B64 must decode to 32 bytes,got %d",len(keyBytes))
	}

	return &Config{
		AppEnv:        get("APP_ENV", "dev"),
		Port:          get("PORT", "8080"),
		DatabaseURL:   must("DATABASE_URL"),
		JWTSecret:     must("JWT_SECRET"),
		JWTExpiresMin: jwtExp,
		BCryptCost:    bcryptCost,
		MasterKey: 	   keyBytes,
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
