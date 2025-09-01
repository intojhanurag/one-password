package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"
    "github.com/intojhanurag/One-Password/apps/api/internals/services"
)

type APIKeyHandler struct {
    Service *services.APIKeyService
}

func NewAPIKeyHandler(s *services.APIKeyService) *APIKeyHandler {
    return &APIKeyHandler{Service: s}
}

func (h *APIKeyHandler) Create(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var req struct {
        Name string `json:"name"`
        Key string `json:"key"` // plaintext key user types
        Description string `json:"description"`
        Tags string `json:"tags"`
    }
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid input", http.StatusBadRequest)
        return
    }

    // Get user id from context (set by auth middleware)
    uid := r.Context().Value("userID")
    if uid == nil {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }
    ownerID := uid.(uint)

    res, err := h.Service.Create(services.CreateAPIKeyInput{
        Name: req.Name,
        Key: req.Key,
        Description: req.Description,
        Tags: req.Tags,
        OwnerID: ownerID,
    })
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Return created metadata and the plaintext key once
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(res)
}

// GET /apikeys  (list)
func (h *APIKeyHandler) List(w http.ResponseWriter, r *http.Request) {
    uid := r.Context().Value("userID")
    if uid == nil {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }
    ownerID := uid.(uint)

    keys, err := h.Service.List(ownerID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // return only safe metadata
    json.NewEncoder(w).Encode(keys)
}

// GET /apikeys/{id}/reveal  (dangerous: returns plaintext, require strong auth)
func (h *APIKeyHandler) Reveal(w http.ResponseWriter, r *http.Request) {
    // parse id from URL (if you use net/http, use strings.TrimPrefix or gorilla/mux)
    idStr := r.URL.Path[len("/apikeys/"):] // naive; prefer a router
    id, _ := strconv.Atoi(idStr)

    uid := r.Context().Value("userID")
    if uid == nil {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }

    plaintext, err := h.Service.GetDecrypted(uid.(uint), uint(id))
    if err != nil {
        http.Error(w, "not found or unauthorized", http.StatusNotFound)
        return
    }
    json.NewEncoder(w).Encode(map[string]string{"key": plaintext})
}
