package handlers

import (
    "encoding/json"
    "net/http"
    "github.com/intojhanurag/One-Password/apps/api/internals/services"
    "github.com/intojhanurag/One-Password/apps/api/internals/middleware"
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
        Key string `json:"key"` 
        Description string `json:"description"`
        Tags string `json:"tags"`
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

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(res)
}


func (h *APIKeyHandler) List(w http.ResponseWriter, r *http.Request) {
    uid := r.Context().Value(middleware.UserIDKey)
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

  
    json.NewEncoder(w).Encode(keys)
}


func (h *APIKeyHandler) RevealByName(w http.ResponseWriter, r *http.Request) {
    
    name:=r.URL.Query().Get("name")

    if name==""{
        http.Error(w, "invalid input", http.StatusBadRequest)   
        return
    }

    uid:=r.Context().Value(middleware.UserIDKey)
    if uid == nil {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }
    plaintext, err:=h.Service.GetByName(uid.(uint),name)
    if err != nil {
        http.Error(w, "not found or unauthorized", http.StatusNotFound)
        return
    }
    json.NewEncoder(w).Encode(map[string]string{
        "name": name,
        "key": plaintext,
    })
}


func (h *APIKeyHandler) Delete(w http.ResponseWriter, r *http.Request) {
    name:=r.URL.Query().Get("name")
    if name==""{
        http.Error(w, "invalid input", http.StatusBadRequest)   
        return
    }
    uid:=r.Context().Value(middleware.UserIDKey)
    if uid == nil {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }
    err:=h.Service.DeleteByName(uid.(uint),name)
    if err != nil {
        http.Error(w, "not found or unauthorized", http.StatusNotFound)
        return
    }
    json.NewEncoder(w).Encode(map[string]string{
        "message": "key deleted",
    })
}