package repository

import (
	"time"

	"github.com/intojhanurag/One-Password/apps/api/internals/models"
	"gorm.io/gorm"
)

type ActivityRepository struct {
	db *gorm.DB
}

type ActivityRepositoryInterface interface {
	Create(activity *models.Activity) error
	List(limit, offset int) ([]models.Activity, error)
	GetByID(id string) (*models.Activity, error)
	CountAll() (int64, error)
	CountToday() (int64, error)
	CountUniqueUsers() (int64, error)
	CountSecurityEvents() (int64, error)
}

func NewActivityRepository(db *gorm.DB) *ActivityRepository{
	return &ActivityRepository{db: db}
}

// Save new activity
func (r *ActivityRepository) Create(activity *models.Activity) error {
	return r.db.Create(activity).Error
}

// List activities with pagination
func (r *ActivityRepository) List(limit, offset int) ([]models.Activity, error) {
	var activities []models.Activity
	err := r.db.
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&activities).Error
	return activities, err
}

// Get activity by ID
func (r *ActivityRepository) GetByID(id string) (*models.Activity, error) {
	var activity models.Activity
	if err := r.db.First(&activity, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &activity, nil
}

// Count all activities
func (r *ActivityRepository) CountAll() (int64, error) {
	var count int64
	err := r.db.Model(&models.Activity{}).Count(&count).Error
	return count, err
}

// Count today’s activities
func (r *ActivityRepository) CountToday() (int64, error) {
	var count int64
	startOfDay := time.Now().Truncate(24 * time.Hour)
	err := r.db.Model(&models.Activity{}).
		Where("created_at >= ?", startOfDay).
		Count(&count).Error
	return count, err
}

// Count unique active users
func (r *ActivityRepository) CountUniqueUsers() (int64, error) {
	var count int64
	err := r.db.Model(&models.Activity{}).
		Select("COUNT(DISTINCT user_id)").
		Count(&count).Error
	return count, err
}

// Count security-related events (example: reveal/delete)
func (r *ActivityRepository) CountSecurityEvents() (int64, error) {
	var count int64
	err := r.db.Model(&models.Activity{}).
		Where("action IN ?", []string{"apikey.reveal", "apikey.delete"}).
		Count(&count).Error
	return count, err
}
