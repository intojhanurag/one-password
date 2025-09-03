package repository

import (
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"gorm.io/gorm"
)

type MembershipRepository interface {
	Create(db *gorm.DB, m *models.Membership) error
	GetByUser(db *gorm.DB, userID uint) (*models.Membership, error)
	Delete(db *gorm.DB, userID uint) error
}

type membershipRepo struct {
	db *gorm.DB
}

func NewMembershipRepository(db *gorm.DB) MembershipRepository {
	return &membershipRepo{db: db}
}

func (r *membershipRepo) Create(db *gorm.DB, m *models.Membership) error {
	return db.Create(m).Error
}

func (r *membershipRepo) GetByUser(db *gorm.DB, userID uint) (*models.Membership, error) {
	var m models.Membership
	err := db.Where("user_id = ?", userID).First(&m).Error
	if err != nil {
		return nil, err
	}
	return &m, nil
}

func (r *membershipRepo) Delete(db *gorm.DB, userID uint) error {
	return db.Where("user_id = ?", userID).Delete(&models.Membership{}).Error
}
