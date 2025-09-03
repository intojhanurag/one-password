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

	
	if err := db.AutoMigrate(
		&models.User{},
		&models.APIKey{},
		&models.Team{},
		&models.Membership{},
		&models.TeamMembership{},
		&models.APIKeyTeam{},
	); err != nil {
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

	// Membership
	membershipRepo := repository.NewMembershipRepository(db)
	membershipSvc := services.NewMembershipService(membershipRepo, db)
	membershipHandler := handlers.NewMembershipHandler(membershipSvc)

	// // TeamMembership
	// teamMembershipRepo := repository.NewTeamMembershipRepository()
	// teamMembershipSvc := services.NewTeamMembershipService(teamMembershipRepo, db)
	// teamMembershipHandler := handlers.NewTeamMembershipHandler(teamMembershipSvc)


	// //apikey-team relationship
	// aktmRepo := repository.NewAPIKeyTeamRepository()
	// aktmSvc := services.NewAPIKeyTeamService(aktmRepo, db)
	// aktmHandler := handlers.NewAPIKeyTeamHandler(aktmSvc)


	
	authMW := middleware.AuthMW([]byte(cfg.JWTSecret))

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "API is healthy 🚀")
	})
	//Auth
	mux.HandleFunc("/auth/signup", h.Signup)
	mux.HandleFunc("/auth/login", h.Signin)   

	// APIKey
	// when a user will add a new api_key
	mux.HandleFunc("/apikeys", authMW(akHandler.Create))
	mux.HandleFunc("/apikeys/list", authMW(akHandler.List))
	mux.HandleFunc("/apikeys/reveal", authMW(akHandler.RevealByName))
	mux.HandleFunc("/apikeys/delete", authMW(akHandler.Delete))

	//Teams
	// when a user create a team
	// then team_id, owner_id
	mux.HandleFunc("/teams", authMW(teamHandler.Create))

	// Team Membership
	//it will basically tell us which use bought our membership
	// user_id, status(default active)
	mux.HandleFunc("/memberships", authMW(membershipHandler.Create))
	mux.HandleFunc("/memberships/delete", authMW(membershipHandler.Delete))


	// Team Membership
	//it will basically tell us which user is member of which team
	// mux.HandleFunc("/team-memberships", authMW(teamMembershipHandler.Create))
	// mux.HandleFunc("/team-memberships/list", authMW(teamMembershipHandler.List))
	// mux.HandleFunc("/team-memberships/delete", authMW(teamMembershipHandler.Delete))

	// APIKey-Team relationship
	// it is basically tell us to which team can access which api_key
	// id , team_id, apikey_id
	// mux.HandleFunc("/apikey-teams", authMW(akTeamHandler.Attach))   // e.g. attach APIKey to a Team
	// mux.HandleFunc("/apikey-teams/list", authMW(akTeamHandler.List))
	// mux.HandleFunc("/apikey-teams/delete", authMW(akTeamHandler.Detach))



	addr := ":" + cfg.Port
	fmt.Println("Starting server at", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
