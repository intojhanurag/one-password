package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/intojhanurag/One-Password/apps/api/internals/config"
	"github.com/intojhanurag/One-Password/apps/api/internals/database"
	"github.com/intojhanurag/One-Password/apps/api/internals/handlers"
	
	"github.com/intojhanurag/One-Password/apps/api/internals/middleware"
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
	"github.com/intojhanurag/One-Password/apps/api/internals/services"
	"github.com/rs/cors"

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
		&models.Activity{},
	); err != nil {
		log.Fatalf("auto-migrate failed: %v", err)
	}


	
	repo := repository.NewUserRepository()
	service := services.NewAuthService(repo, db, cfg.BCryptCost)
	h := handlers.NewAuthHandler(service, cfg)

	akRepo := repository.NewAPIKeyRepository()
	akSvc := services.NewAPIKeyService(akRepo, db, cfg.MasterKey)
	akHandler := handlers.NewAPIKeyHandler(akSvc)

	// // TeamMembership
	teamMembershipRepo := repository.NewTeamMembershipRepository(db)
	teamMembershipSvc := services.NewTeamMembershipService(teamMembershipRepo,db)
	teamMembershipHandler := handlers.NewTeamMembershipHandler(teamMembershipSvc)

	
	teamRepo := repository.NewTeamRepository()
	teamSvc := services.NewTeamService(teamRepo,teamMembershipRepo,db)
	teamHandler := handlers.NewTeamHandler(teamSvc)

	// Membership
	membershipRepo := repository.NewMembershipRepository(db)
	membershipSvc := services.NewMembershipService(membershipRepo, db)
	membershipHandler := handlers.NewMembershipHandler(membershipSvc)

	// //apikey-team relationship
	aktmRepo := repository.NewAPIKeyTeamRepository(db)
	aktmSvc := services.NewAPIKeyTeamService(aktmRepo)
	aktmHandler := handlers.NewAPIKeyTeamHandler(aktmSvc)

	activityRepo := repository.NewActivityRepository(db)

	// Dashboard
	dashboardSvc := services.NewDashboardService(db, akRepo, teamRepo, *activityRepo)
	dashboardHandler := handlers.NewDashboardHandler(dashboardSvc)

	
	// activitySvc := services.NewActivityService(activityRepo)
	activityHandler := handlers.NewActivityHandler(activityRepo)

	

	
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

	// Dashboard
	mux.HandleFunc("/dashboard", authMW(dashboardHandler.Get))
	mux.HandleFunc("/dashboard/teams",authMW(dashboardHandler.GetTeamsDashboard))

	mux.HandleFunc("/dashboard/activity", authMW(activityHandler.ListActivities))
	mux.HandleFunc("/dashboard/activity/detail", authMW(activityHandler.GetActivityStats))


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
	mux.HandleFunc("/team-memberships", authMW(teamMembershipHandler.Create))
	mux.HandleFunc("/team-memberships/list", authMW(teamMembershipHandler.List))
	mux.HandleFunc("/team-memberships/delete", authMW(teamMembershipHandler.Delete))

	// APIKey-Team relationship
	// it is basically tell us to which team can access which api_key
	// id , team_id, apikey_id
	mux.HandleFunc("/apikey-teams", authMW(aktmHandler.Attach))   // e.g. attach APIKey to a Team
	mux.HandleFunc("/apikey-teams/list", authMW(aktmHandler.List))
	mux.HandleFunc("/apikey-teams/delete", authMW(aktmHandler.Detach))


	// Configure CORS via env FRONTEND_ORIGINS (comma-separated)
	originsEnv := os.Getenv("FRONTEND_ORIGINS")
	var allowedOrigins []string
	if originsEnv != "" {
		for _, o := range strings.Split(originsEnv, ",") {
			o = strings.TrimSpace(o)
			if o != "" { allowedOrigins = append(allowedOrigins, o) }
		}
	} else {
		allowedOrigins = []string{"*"}
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})


	addr := ":" + cfg.Port
	fmt.Println("Starting server at", addr)
	if err := http.ListenAndServe(addr, c.Handler(mux)); err != nil {
		log.Fatal(err)
	}
}
