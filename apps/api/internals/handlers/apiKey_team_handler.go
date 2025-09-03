package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/intojhanurag/One-Password/apps/api/internals/services"
)

type APIKeyTeamHandler struct {
	Service *services.APIKeyTeamService
}

func NewAPIKeyTeamHandler(s *services.APIKeyTeamService) *APIKeyTeamHandler {
	return &APIKeyTeamHandler{Service: s}
}

// Attach APIKey to Team
func (h *APIKeyTeamHandler) Attach(w http.ResponseWriter, r *http.Request) {
	var req struct {
		TeamID   uint `json:"team_id"`
		APIKeyID uint `json:"api_key_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	if err := h.Service.Attach(req.TeamID, req.APIKeyID); err != nil {
		http.Error(w, fmt.Sprintf("failed to attach: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "attached successfully")
}

// List APIKeys of a Team
func (h *APIKeyTeamHandler) List(w http.ResponseWriter, r *http.Request) {
	teamIDStr := r.URL.Query().Get("team_id")
	if teamIDStr == "" {
		http.Error(w, "team_id required", http.StatusBadRequest)
		return
	}
	teamID, _ := strconv.Atoi(teamIDStr)
	ats, err := h.Service.ListByTeam(uint(teamID))
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to list: %v", err), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(ats)
}

// Detach APIKey from Team
func (h *APIKeyTeamHandler) Detach(w http.ResponseWriter, r *http.Request) {
	var req struct {
		TeamID   uint `json:"team_id"`
		APIKeyID uint `json:"api_key_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	if err := h.Service.Detach(req.TeamID, req.APIKeyID); err != nil {
		http.Error(w, fmt.Sprintf("failed to detach: %v", err), http.StatusInternalServerError)
		return
	}

	fmt.Fprintln(w, "detached successfully")
}
