package models

import "time"


type Team struct {
	ID          uint      `gorm:"primaryKey"`
	Name        string    `gorm:"size:100;not null"`
	Description string    `gorm:"size:500"`
	OwnerID     uint      `gorm:"not null;index"`
	CreatedAt   time.Time
	Owner 		User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:OwnerID;references:ID"`
	APIKeys    []APIKey `gorm:"many2many:api_key_teams;" json:"apiKeys"`
	
}