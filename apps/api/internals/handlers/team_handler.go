package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/intojhanurag/One-Password/apps/api/internals/middleware"
	"github.com/intojhanurag/One-Password/apps/api/internals/services"
)

type TeamHandler struct {
	Service *services.TeamService
}

func NewTeamHandler(s *services.TeamService) *TeamHandler { return &TeamHandler{Service: s} }

// Create handles POST /teams to create a new team for the authenticated user
func (h *TeamHandler) Create(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	uid := r.Context().Value(middleware.UserIDKey)
	if uid == nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	ownerID := uid.(uint)

	res, err := h.Service.Create(services.CreateTeamInput{
		Name:        req.Name,
		Description: req.Description,
		OwnerID:     ownerID,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}