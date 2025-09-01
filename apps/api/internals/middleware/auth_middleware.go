package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserIDKey contextKey = "userID"


func AuthMW(secret []byte) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {

			
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
				return
			}

			
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "Invalid Authorization format", http.StatusUnauthorized)
				return
			}
			tokenStr := parts[1]

			
			token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
				}
				return secret, nil
			})

			if err != nil || !token.Valid {
				http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
				return
			}

		
			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				if subFloat, ok := claims["sub"].(float64); ok {
					userID := uint(subFloat)

					
					ctx := context.WithValue(r.Context(), UserIDKey, userID)
					r = r.WithContext(ctx)
				} else {
					http.Error(w, "user ID not found in token", http.StatusUnauthorized)
					return
				}
			}
			
			next(w, r)
		}
	}
}
