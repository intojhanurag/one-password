package models

type APIKeyTeam struct {
	ID   uint  `gorm:"primaryKey"`
	TeamID uint `gorm:"not null;index"`
	APIKeyID uint `gorm:"not null;index"`
	Team Team `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:TeamID;references:ID"`
	APIKey APIKey `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:APIKeyID;references:ID"`
}