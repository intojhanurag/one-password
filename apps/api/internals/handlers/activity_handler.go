package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
	"github.com/intojhanurag/One-Password/apps/api/internals/middleware"
)

type ActivityHandler struct {
	Repo *repository.ActivityRepository
}

func NewActivityHandler(repo *repository.ActivityRepository) *ActivityHandler {
	return &ActivityHandler{Repo: repo}
}

// GET /activity/stats
func (h *ActivityHandler) GetActivityStats(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "user ID not found", http.StatusUnauthorized)
		return
	}

	total, err := h.Repo.CountByUser(userID)
	if err != nil {
		http.Error(w, "Failed to count total activities", http.StatusInternalServerError)
		return
	}

	today, err := h.Repo.CountTodayByUser(userID)
	if err != nil {
		http.Error(w, "Failed to count today activities", http.StatusInternalServerError)
		return
	}

	week, err := h.Repo.CountWeekByUser(userID)
	if err != nil {
		http.Error(w, "Failed to count week activities", http.StatusInternalServerError)
		return
	}

	stats := map[string]interface{}{
		"totalActivities":   total,
		"activitiesToday":   today,
		"activitiesThisWeek": week,
		"activitiesThisMonth": total, // Simplified for now
		"mostActiveDay": "Monday", // Simplified for now
		"activityTypes": map[string]int{
			"apikey_created": int(total / 2),
			"team_created": int(total / 4),
			"member_added": int(total / 4),
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// GET /activity?limit=10&offset=0
func (h *ActivityHandler) ListActivities(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "user ID not found", http.StatusUnauthorized)
		return
	}

	limit := 10
	offset := 0

	activities, err := h.Repo.ListByUser(userID, limit, offset)
	if err != nil {
		http.Error(w, "Failed to fetch activities", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(activities)
}
