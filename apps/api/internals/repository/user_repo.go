package repository

import (
	"gorm.io/gorm"
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
)

type UserRepository interface {
	Create(db *gorm.DB, user *models.User) error
	FindByEmail(db *gorm.DB, email string) (*models.User, error)
}

type userRepository struct{}

func NewUserRepository() UserRepository { return &userRepository{} }

func (r *userRepository) Create(db *gorm.DB, user *models.User) error {
	return db.Create(user).Error
}

func (r *userRepository) FindByEmail(db *gorm.DB, email string) (*models.User, error) {
	var u models.User
	if err := db.Where("email = ?", email).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}