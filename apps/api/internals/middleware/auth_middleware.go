package middleware

import (
	"context"
	"net/http"
	"strings"
	"fmt"

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

			fmt.Println("Authorization header:", authHeader)
			


			
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "Invalid Authorization format", http.StatusUnauthorized)
				return
			}
			tokenStr := parts[1]

			fmt.Println("Token string:", tokenStr)

			
			token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
				

				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, http.ErrAbortHandler
				}
				return secret, nil


			})

			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				fmt.Println("Token claims:", claims)
			}


			if err != nil || !token.Valid {
				http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
				return
			}

			
			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				if subFloat, ok := claims["sub"].(float64); ok {
					userID := uint(subFloat) // convert to uint
					fmt.Println("Extracted user ID:", userID)

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
