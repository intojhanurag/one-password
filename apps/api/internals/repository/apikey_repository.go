package repository

import (
    "gorm.io/gorm"
    "github.com/intojhanurag/One-Password/apps/api/internals/models"
)

type APIKeyRepository interface {
    Create(db *gorm.DB, k *models.APIKey) error
    ListByOwner(db *gorm.DB, ownerID uint) ([]models.APIKey, error)
    GetByID(db *gorm.DB, ownerID, id uint) (*models.APIKey, error)
    Delete(db *gorm.DB, ownerID, id uint) error
}

type apiKeyRepo struct{}

func NewAPIKeyRepository() APIKeyRepository {
    return &apiKeyRepo{}
}

func (r *apiKeyRepo) Create(db *gorm.DB, k *models.APIKey) error {
    return db.Create(k).Error
}

func (r *apiKeyRepo) ListByOwner(db *gorm.DB, ownerID uint) ([]models.APIKey, error) {
    var keys []models.APIKey
    err := db.Where("owner_id = ?", ownerID).Find(&keys).Error
    return keys, err
}

func (r *apiKeyRepo) GetByID(db *gorm.DB, ownerID, id uint) (*models.APIKey, error) {
    var key models.APIKey
    err := db.Where("owner_id = ? AND id = ?", ownerID, id).First(&key).Error
    return &key, err
}

func (r *apiKeyRepo) Delete(db *gorm.DB, ownerID, id uint) error {
    return db.Where("owner_id = ? AND id = ?", ownerID, id).Delete(&models.APIKey{}).Error
}
