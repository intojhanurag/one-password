package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/intojhanurag/One-Password/apps/api/internals/config"
	"github.com/intojhanurag/One-Password/apps/api/internals/database"
	"github.com/intojhanurag/One-Password/apps/api/internals/handlers"
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
	"github.com/intojhanurag/One-Password/apps/api/internals/services"
)

func main() {
	cfg := config.Load()

	db := database.Connect(cfg.DatabaseURL)

	// Auto-migrate models
	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Fatalf("auto-migrate failed: %v", err)
	}

	// Wire dependencies
	repo := repository.NewUserRepository()
	service := services.NewAuthService(repo, db, cfg.BCryptCost)
	h := handlers.NewAuthHandler(service, cfg)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "API is healthy 🚀")
	})
	mux.HandleFunc("/auth/signup", h.Signup)

	addr := ":" + cfg.Port
	fmt.Println("Starting server at", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
