package repository

import (
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"gorm.io/gorm"
)

type APIKeyTeamRepository interface {
	Attach(at *models.APIKeyTeam) error
	ListByTeam(teamID uint) ([]models.APIKeyTeam, error)
	ListByAPIKey(apiKeyID uint) ([]models.APIKeyTeam, error)
	Detach(teamID, apiKeyID uint) error
}

type apiKeyTeamRepo struct {
	db *gorm.DB
}

func NewAPIKeyTeamRepository(db *gorm.DB) APIKeyTeamRepository {
	return &apiKeyTeamRepo{db: db}
}

func (r *apiKeyTeamRepo) Attach(at *models.APIKeyTeam) error {
	return r.db.Create(at).Error
}

func (r *apiKeyTeamRepo) ListByTeam(teamID uint) ([]models.APIKeyTeam, error) {
	var ats []models.APIKeyTeam
	err := r.db.Where("team_id = ?", teamID).Find(&ats).Error
	return ats, err
}

func (r *apiKeyTeamRepo) ListByAPIKey(apiKeyID uint) ([]models.APIKeyTeam, error) {
	var ats []models.APIKeyTeam
	err := r.db.Where("api_key_id = ?", apiKeyID).Find(&ats).Error
	return ats, err
}

func (r *apiKeyTeamRepo) Detach(teamID, apiKeyID uint) error {
	return r.db.Where("team_id = ? AND api_key_id = ?", teamID, apiKeyID).Delete(&models.APIKeyTeam{}).Error
}
