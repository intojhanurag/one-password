package models

import "time"


type APIKey struct {
    ID         uint      `gorm:"primaryKey" json:"id"`
    Name       string    `gorm:"size:255;not null" json:"name"`
    OwnerID    uint      `gorm:"not null;index" json:"ownerId"` // FK to users.id (if you want)
	Owner      User      `gorm:"foreignKey:OwnerID;constraint:OnDelete:CASCADE;" json:"-"`
    Ciphertext string    `gorm:"type:text;not null" json:"-"`   // base64 ciphertext
    Nonce      string    `gorm:"size:64;not null" json:"-"`     // base64 nonce
    Description string   `gorm:"size:1024" json:"description,omitempty"`
    Tags       string    `gorm:"size:255" json:"tags,omitempty"` // comma-separated or separate table
    CreatedAt  time.Time `json:"createdAt"`
    UpdatedAt  time.Time `json:"updatedAt"`
}
