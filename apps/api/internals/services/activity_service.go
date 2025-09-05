package services

import (
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
)

type ActivityService struct {
	repo *repository.ActivityRepository
}

func NewActivityService(repo *repository.ActivityRepository) *ActivityService {
	return &ActivityService{repo: repo}
}

func (s *ActivityService) GetDashboard(limit, offset int) (*models.ActivityDashboard, error) {
	records, err := s.repo.List(limit, offset)
	if err != nil {
		return nil, err
	}

	total, _ := s.repo.CountAll()
	today, _ := s.repo.CountToday()
	users, _ := s.repo.CountUniqueUsers()
	sec, _ := s.repo.CountSecurityEvents()

	return &models.ActivityDashboard{
		Summary: models.ActivitySummary{
			TotalActions:   total,
			TodaysActivity: today,
			ActiveUsers:    users,
			SecurityEvents: sec,
		},
		Records: records,
	}, nil
}

func (s *ActivityService) GetByID(id string) (*models.Activity, error) {
	return s.repo.GetByID(id)
}
