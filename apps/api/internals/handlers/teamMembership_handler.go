package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/intojhanurag/One-Password/apps/api/internals/services"
)

type TeamMembershipHandler struct {
	svc services.TeamMembershipService
}

func NewTeamMembershipHandler(svc services.TeamMembershipService) *TeamMembershipHandler {
	return &TeamMembershipHandler{svc: svc}
}

// POST /team-memberships
func (h *TeamMembershipHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body struct {
		TeamID uint   `json:"team_id"`
		UserID uint   `json:"user_id"`
		Role   string `json:"role"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	if body.Role == "" {
		body.Role = "member"
	}

	if err := h.svc.AddUserToTeam(body.TeamID, body.UserID, body.Role); err != nil {
		http.Error(w, "failed to add member: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "user added to team"})
}

// GET /team-memberships/list?team_id=1
// OR  /team-memberships/list?user_id=2
func (h *TeamMembershipHandler) List(w http.ResponseWriter, r *http.Request) {
	teamIDStr := r.URL.Query().Get("team_id")
	userIDStr := r.URL.Query().Get("user_id")

	if teamIDStr != "" {
		teamID, _ := strconv.Atoi(teamIDStr)
		members, err := h.svc.GetTeamMemberships(uint(teamID))
		if err != nil {
			http.Error(w, "failed to list team memberships", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(members)
		return
	}

	if userIDStr != "" {
		userID, _ := strconv.Atoi(userIDStr)
		members, err := h.svc.GetUserMemberships(uint(userID))
		if err != nil {
			http.Error(w, "failed to list user memberships", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(members)
		return
	}

	http.Error(w, "team_id or user_id required", http.StatusBadRequest)
}

// DELETE /team-memberships/delete?team_id=1&user_id=2
func (h *TeamMembershipHandler) Delete(w http.ResponseWriter, r *http.Request) {
	teamIDStr := r.URL.Query().Get("team_id")
	userIDStr := r.URL.Query().Get("user_id")

	if teamIDStr == "" || userIDStr == "" {
		http.Error(w, "team_id and user_id required", http.StatusBadRequest)
		return
	}

	teamID, _ := strconv.Atoi(teamIDStr)
	userID, _ := strconv.Atoi(userIDStr)

	if err := h.svc.RemoveUserFromTeam(uint(teamID), uint(userID)); err != nil {
		http.Error(w, "failed to remove member", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "user removed from team"})
}
