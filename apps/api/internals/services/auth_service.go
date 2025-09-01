package services

import (
	"errors"

	"gorm.io/gorm"
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
	"github.com/intojhanurag/One-Password/apps/api/internals/utils"
)

type AuthService struct {
	Repo      repository.UserRepository
	DB        *gorm.DB
	BCryptCost int
}

type SignupInput struct {
	FullName string
	Email    string
	Password string
}

type SignupResult struct {
	User  *models.User
	Token string
}

type SigninInput struct {
	Email    string
	Password string
}

type SigninResult struct {
	User  *models.User
	Token string
}


func NewAuthService(repo repository.UserRepository, db *gorm.DB, cost int) *AuthService {
	return &AuthService{Repo: repo, DB: db, BCryptCost: cost}
}

func (s *AuthService) Signup(secret string, jwtExpMin int, in SignupInput) (*SignupResult, error) {
	if in.Email == "" || in.Password == "" || in.FullName == "" {
		return nil, errors.New("missing required fields")
	}

	// Check if user exists
	if _, err := s.Repo.FindByEmail(s.DB, in.Email); err == nil {
		return nil, errors.New("email already registered")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hash, err := utils.HashPassword(in.Password, s.BCryptCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{FullName: in.FullName, Email: in.Email, PasswordHash: hash}
	if err := s.Repo.Create(s.DB, user); err != nil {
		return nil, err
	}

	token, err := utils.GenerateJWT(secret, user.ID, jwtExpMin)
	if err != nil {
		return nil, err
	}

	return &SignupResult{User: user, Token: token}, nil
}



func (s *AuthService) Signin(secret string, jwtExpMin int, in SigninInput) (*SigninResult, error) {
	if in.Email == "" || in.Password == "" {
		return nil, errors.New("missing email or password")
	}

	
	user, err := s.Repo.FindByEmail(s.DB, in.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid email or password")
		}
		return nil, err
	}

	
	if !utils.CheckPassword(user.PasswordHash,in.Password) {
		return nil, errors.New("invalid email or password")
	}

	
	token, err := utils.GenerateJWT(secret, user.ID, jwtExpMin)
	if err != nil {
		return nil, err
	}

	return &SigninResult{User: user, Token: token}, nil
}
