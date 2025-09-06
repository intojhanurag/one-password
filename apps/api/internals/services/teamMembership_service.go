package services

import (
	"strconv"
	"fmt"
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
	"gorm.io/gorm"
)

type TeamMembershipService interface {
	AddUserToTeam(teamID, userID uint, role string) error
	GetTeamMemberships(teamID uint) ([]models.TeamMembership, error)
	GetUserMemberships(userID uint) ([]models.TeamMembership, error)
	RemoveUserFromTeam(teamID, userID uint) error
	
}

type teamMembershipService struct {
	repo repository.TeamMembershipRepository
	DB   *gorm.DB
}

func NewTeamMembershipService(repo repository.TeamMembershipRepository, DB   *gorm.DB) TeamMembershipService {
	return &teamMembershipService{repo: repo, DB: DB}
}

func (s *teamMembershipService) AddUserToTeam(teamID, userID uint, role string) error {
	m := &models.TeamMembership{
		TeamID: teamID,
		UserID: userID,
		Role:   role,
	}

	// Then log the activity
	activity := &models.Activity{
		UserID:   userID,
		Type:     "member_added",
		Entity:   "team",
		EntityID: teamID,
		Message:  "Member added: " + strconv.Itoa(int(userID)),
	}

	if err := s.DB.Create(activity).Error; err != nil {
		fmt.Printf("failed to log activity: %v\n", err)
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
