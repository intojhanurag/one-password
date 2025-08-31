package utils

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes a plain text password using bcrypt with the provided cost.
func HashPassword(password string, cost int) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// CheckPassword compares a bcrypt hashed password with its possible plaintext equivalent.
func CheckPassword(hashedPassword, candidate string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(candidate)) == nil
}