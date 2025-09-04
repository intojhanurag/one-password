package models

import "time"

// Activity represents a user action (e.g., creating a team, adding/deleting an API key)
// Stored to power dashboard metrics like recent activity and weekly counts.
type Activity struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"index;not null" json:"user_id"`
	Type      string    `gorm:"size:100;not null" json:"type"`      // e.g., "apikey_created", "apikey_deleted", "team_created"
	Entity    string    `gorm:"size:100;not null" json:"entity"`    // e.g., "apikey", "team"
	EntityID  uint      `gorm:"index" json:"entity_id"`
	Message   string    `gorm:"size:255" json:"message"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}