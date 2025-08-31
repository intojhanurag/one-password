package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/intojhanurag/One-Password/apps/api/internals/config"
	"github.com/intojhanurag/One-Password/apps/api/internals/services"
)

type AuthHandler struct {
	Service *services.AuthService
	Cfg     *config.Config
}

type signupRequest struct {
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type signupResponse struct {
	ID       uint   `json:"id"`
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Token    string `json:"token"`
}

func NewAuthHandler(s *services.AuthService, cfg *config.Config) *AuthHandler {
	return &AuthHandler{Service: s, Cfg: cfg}
}

func (h *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req signupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	res, err := h.Service.Signup(h.Cfg.JWTSecret, h.Cfg.JWTExpiresMin, services.SignupInput{
		FullName: req.FullName,
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(signupResponse{
		ID:       res.User.ID,
		FullName: res.User.FullName,
		Email:    res.User.Email,
		Token:    res.Token,
	})
}


func (h *AuthHandler) Signin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var input services.SigninInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}

	res, err := h.Service.Signin(h.Cfg.JWTSecret, h.Cfg.JWTExpiresMin, input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":       res.User.ID,
		"fullName": res.User.FullName,
		"email":    res.User.Email,
		"token":    res.Token,
	})
}
