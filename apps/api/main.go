package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/intojhanurag/One-Password/apps/api/internals/config"
	"github.com/intojhanurag/One-Password/apps/api/internals/database"
	"github.com/intojhanurag/One-Password/apps/api/internals/handlers"
	
	"github.com/intojhanurag/One-Password/apps/api/internals/middleware"
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

	if err := db.AutoMigrate(&models.APIKey{}); err != nil {
		log.Fatalf("auto-migrate failed: %v", err)
	}
	if err := db.AutoMigrate(&models.Team{}); err != nil {
		log.Fatalf("auto-migrate failed: %v", err)
	}

	
	repo := repository.NewUserRepository()
	service := services.NewAuthService(repo, db, cfg.BCryptCost)
	h := handlers.NewAuthHandler(service, cfg)

	akRepo := repository.NewAPIKeyRepository()
	akSvc := services.NewAPIKeyService(akRepo, db, cfg.MasterKey)
	akHandler := handlers.NewAPIKeyHandler(akSvc)

	
	teamRepo := repository.NewTeamRepository()
	teamSvc := services.NewTeamService(teamRepo, db)
	teamHandler := handlers.NewTeamHandler(teamSvc)


	
	authMW := middleware.AuthMW([]byte(cfg.JWTSecret))

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "API is healthy 🚀")
	})
	mux.HandleFunc("/auth/signup", h.Signup)
	mux.HandleFunc("/auth/login", h.Signin)   
	mux.HandleFunc("/apikeys", authMW(akHandler.Create))
	mux.HandleFunc("/apikeys/list", authMW(akHandler.List))
	mux.HandleFunc("/apikeys/reveal", authMW(akHandler.RevealByName))
	mux.HandleFunc("/apikeys/delete", authMW(akHandler.Delete))
	mux.HandleFunc("/teams", authMW(teamHandler.Create))



	addr := ":" + cfg.Port
	fmt.Println("Starting server at", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
