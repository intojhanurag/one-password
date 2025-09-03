package services

import (
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
)

type TeamMembershipService interface {
	AddUserToTeam(teamID, userID uint, role string) error
	GetTeamMemberships(teamID uint) ([]models.TeamMembership, error)
	GetUserMemberships(userID uint) ([]models.TeamMembership, error)
	RemoveUserFromTeam(teamID, userID uint) error
}

type teamMembershipService struct {
	repo repository.TeamMembershipRepository
}

func NewTeamMembershipService(repo repository.TeamMembershipRepository) TeamMembershipService {
	return &teamMembershipService{repo: repo}
}

func (s *teamMembershipService) AddUserToTeam(teamID, userID uint, role string) error {
	m := &models.TeamMembership{
		TeamID: teamID,
		UserID: userID,
		Role:   role,
	}
	return s.repo.Create(m)
}

func (s *teamMembershipService) GetTeamMemberships(teamID uint) ([]models.TeamMembership, error) {
	return s.repo.ListByTeam(teamID)
}

func (s *teamMembershipService) GetUserMemberships(userID uint) ([]models.TeamMembership, error) {
	return s.repo.ListByUser(userID)
}

func (s *teamMembershipService) RemoveUserFromTeam(teamID, userID uint) error {
	return s.repo.Delete(teamID, userID)
}
