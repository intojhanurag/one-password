package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/intojhanurag/One-Password/apps/api/internals/middleware"
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/services"
)

type MembershipHandler struct {
	service *services.MembershipService
}

func NewMembershipHandler(service *services.MembershipService) *MembershipHandler {
	return &MembershipHandler{service: service}
}

// POST /memberships
func (h *MembershipHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uint)

	m := &models.Membership{
		UserID: userID,
		Status: "active",
	}

	if err := h.service.Create(m); err != nil {
		http.Error(w, "could not create membership", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(m)
}

// GET /memberships
func (h *MembershipHandler) Get(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uint)

	m, err := h.service.GetByUser(userID)
	if err != nil {
		http.Error(w, "membership not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(m)
}

// DELETE /memberships
func (h *MembershipHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(uint)

	if err := h.service.Delete(userID); err != nil {
		http.Error(w, "failed to delete membership", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
