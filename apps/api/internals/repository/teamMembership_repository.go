package repository

import (
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"gorm.io/gorm"
)

type TeamMembershipRepository interface {
	Create(m *models.TeamMembership) error
	ListByTeam(teamID uint) ([]models.TeamMembership, error)
	ListByUser(userID uint) ([]models.TeamMembership, error)
	Delete(teamID, userID uint) error
}

type teamMembershipRepo struct {
	db *gorm.DB
}

func NewTeamMembershipRepository(db *gorm.DB) TeamMembershipRepository {
	return &teamMembershipRepo{db: db}
}

func (r *teamMembershipRepo) Create(m *models.TeamMembership) error {
	return r.db.Create(m).Error
}

func (r *teamMembershipRepo) ListByTeam(teamID uint) ([]models.TeamMembership, error) {
	var memberships []models.TeamMembership
	err := r.db.Where("team_id = ?", teamID).Find(&memberships).Error
	return memberships, err
}

func (r *teamMembershipRepo) ListByUser(userID uint) ([]models.TeamMembership, error) {
	var memberships []models.TeamMembership
	err := r.db.Where("user_id = ?", userID).Find(&memberships).Error
	return memberships, err
}

func (r *teamMembershipRepo) Delete(teamID, userID uint) error {
	return r.db.Where("team_id = ? AND user_id = ?", teamID, userID).Delete(&models.TeamMembership{}).Error
}
