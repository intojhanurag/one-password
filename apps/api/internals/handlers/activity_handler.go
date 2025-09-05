package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
)

type ActivityHandler struct {
	Repo *repository.ActivityRepository
}

func NewActivityHandler(repo *repository.ActivityRepository) *ActivityHandler {
	return &ActivityHandler{Repo: repo}
}

// GET /activity/stats
func (h *ActivityHandler) GetActivityStats(w http.ResponseWriter, r *http.Request) {
	total, err := h.Repo.CountAll()
	if err != nil {
		http.Error(w, "Failed to count total activities", http.StatusInternalServerError)
		return
	}

	today, err := h.Repo.CountToday()
	if err != nil {
		http.Error(w, "Failed to count today activities", http.StatusInternalServerError)
		return
	}

	users, err := h.Repo.CountUniqueUsers()
	if err != nil {
		http.Error(w, "Failed to count active users", http.StatusInternalServerError)
		return
	}

	securityEvents, err := h.Repo.CountSecurityEvents()
	if err != nil {
		http.Error(w, "Failed to count security events", http.StatusInternalServerError)
		return
	}

	stats := map[string]interface{}{
		"totalActions":   total,
		"actionsToday":   today,
		"activeUsers":    users,
		"securityEvents": securityEvents,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// GET /activity?limit=10&offset=0
func (h *ActivityHandler) ListActivities(w http.ResponseWriter, r *http.Request) {
	limit := 10
	offset := 0

	activities, err := h.Repo.List(limit, offset)
	if err != nil {
		http.Error(w, "Failed to fetch activities", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(activities)
}
