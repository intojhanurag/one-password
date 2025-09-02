package repository

import (
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"gorm.io/gorm"
)

type TeamRepository interface {
	Create(db *gorm.DB, t *models.Team) error
}

type teamRepo struct{}

func NewTeamRepository() TeamRepository { return &teamRepo{} }

func (r *teamRepo) Create(db *gorm.DB, t *models.Team) error {
	return db.Create(t).Error
}