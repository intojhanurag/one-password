package services

import (
	"errors"
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
)

type APIKeyTeamService struct {
	Repo repository.APIKeyTeamRepository
}

func NewAPIKeyTeamService(repo repository.APIKeyTeamRepository) *APIKeyTeamService {
	return &APIKeyTeamService{Repo: repo}
}

func (s *APIKeyTeamService) Attach(teamID, apiKeyID uint) error {
	if teamID == 0 || apiKeyID == 0 {
		return errors.New("team_id and api_key_id are required")
	}
	at := &models.APIKeyTeam{
		TeamID:   teamID,
		APIKeyID: apiKeyID,
	}
	return s.Repo.Attach(at)
}

func (s *APIKeyTeamService) ListByTeam(teamID uint) ([]models.APIKeyTeam, error) {
	return s.Repo.ListByTeam(teamID)
}

func (s *APIKeyTeamService) ListByAPIKey(apiKeyID uint) ([]models.APIKeyTeam, error) {
	return s.Repo.ListByAPIKey(apiKeyID)
}

func (s *APIKeyTeamService) Detach(teamID, apiKeyID uint) error {
	return s.Repo.Detach(teamID, apiKeyID)
}
