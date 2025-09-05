package services

import (
	"errors"
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
	"gorm.io/gorm"
)

type TeamService struct {
	Repo            repository.TeamRepository
	MembershipRepo  repository.TeamMembershipRepository
	DB              *gorm.DB
}

type CreateTeamInput struct {
	Name        string
	Description string
	OwnerID     uint
}

type CreateTeamResult struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func NewTeamService(repo repository.TeamRepository,membershipRepo repository.TeamMembershipRepository, db *gorm.DB) *TeamService {
	return &TeamService{Repo: repo,MembershipRepo: membershipRepo, DB: db}
}

func (s *TeamService) Create(in CreateTeamInput) (*CreateTeamResult, error) {
	if in.Name == "" {
		return nil, errors.New("name required")
	}

	t := &models.Team{
		Name:        in.Name,
		Description: in.Description,
		OwnerID:     in.OwnerID,
	}
	if err := s.Repo.Create(s.DB, t); err != nil {
		return nil, err
	}

	membership:= models.TeamMembership{
		TeamID: t.ID,
		UserID: in.OwnerID,
		Role: "owner",
	}

	if err := s.MembershipRepo.Create(&membership); err != nil {
		return nil, err
	}

	activity:= &models.Activity{
		UserID: in.OwnerID,
		Type: "team_created",
		EntityID: t.ID,
		Message: "Team created: "+ t.Name,
	}

	s.DB.Create(activity)
	return &CreateTeamResult{ID: t.ID, Name: t.Name, Description: t.Description}, nil
}