package handlers

import (
    "encoding/json"
    "net/http"
    "github.com/intojhanurag/One-Password/apps/api/internals/services"
	"github.com/intojhanurag/One-Password/apps/api/internals/middleware"
)

type DashboardHandler struct {
    service *services.DashboardService
}

func NewDashboardHandler(s *services.DashboardService) *DashboardHandler {
    return &DashboardHandler{service: s}
}

func (h *DashboardHandler) Get(w http.ResponseWriter, r *http.Request) {
   userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "user ID not found", http.StatusUnauthorized)
		return
	}
    data, err := h.service.GetDashboard(userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(data)
}
func (h* DashboardHandler) GetTeamsDashboard(w http.ResponseWriter, r *http.Request){
    userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "user ID not found", http.StatusUnauthorized)
		return
	}

    data,err :=h.service.GetTeamDashboard(userID)

    if err!=nil {
        http.Error(w,"failed to fetch dashboard data",http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type","application/json")
    json.NewEncoder(w).Encode(data)
}
