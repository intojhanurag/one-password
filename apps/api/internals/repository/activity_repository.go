package repository

import (
	"time"

	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"gorm.io/gorm"
)

type ActivityRepository interface {
	Create(db *gorm.DB, a *models.Activity) error
	RecentByUser(db *gorm.DB, userID uint, limit int) ([]models.Activity, error)
	CountThisWeekByUser(db *gorm.DB, userID uint) (int64, error)
}

type activityRepo struct{}

func NewActivityRepository() ActivityRepository { return &activityRepo{} }

func (r *activityRepo) Create(db *gorm.DB, a *models.Activity) error {
	return db.Create(a).Error
}

func (r *activityRepo) RecentByUser(db *gorm.DB, userID uint, limit int) ([]models.Activity, error) {
	var list []models.Activity
	if limit <= 0 { limit = 5 }
	err := db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Find(&list).Error
	return list, err
}

func (r *activityRepo) CountThisWeekByUser(db *gorm.DB, userID uint) (int64, error) {
	var count int64
	startOfWeek := startOfCurrentWeek()
	err := db.Model(&models.Activity{}).
		Where("user_id = ? AND created_at >= ?", userID, startOfWeek).
		Count(&count).Error
	return count, err
}

func startOfCurrentWeek() time.Time {
	now := time.Now()
	offset := (int(now.Weekday()) + 6) % 7 // Monday as start of week
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	return start.AddDate(0, 0, -offset)
}