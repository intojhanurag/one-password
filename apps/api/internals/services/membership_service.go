package services

import (
	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"
	"gorm.io/gorm"
)

type MembershipService struct {
	repo repository.MembershipRepository
	db   *gorm.DB
}

func NewMembershipService(repo repository.MembershipRepository, db *gorm.DB) *MembershipService {
	return &MembershipService{repo: repo, db: db}
}

func (s *MembershipService) Create(m *models.Membership) error {
	return s.repo.Create(s.db, m)
}

func (s *MembershipService) GetByUser(userID uint) (*models.Membership, error) {
	return s.repo.GetByUser(s.db, userID)
}

func (s *MembershipService) Delete(userID uint) error {
	return s.repo.Delete(s.db, userID)
}
