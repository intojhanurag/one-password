package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// GenerateJWT generates a signed JWT token with user ID as subject.
func GenerateJWT(secret string, userID uint, expiresMinutes int) (string, error) {
	claims := jwt.MapClaims{
		"sub":  userID,
		"exp":  time.Now().Add(time.Duration(expiresMinutes) * time.Minute).Unix(),
		"iat":  time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}