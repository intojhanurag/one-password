package models

import "time"

type TeamMembership struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	TeamID    uint      `gorm:"not null;index" json:"team_id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	Role      string    `gorm:"type:varchar(50);default:member" json:"role"` // "owner" | "member"
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Relations (optional, for preload)
	Team     *Team      `gorm:"foreignKey:TeamID;constraint:OnDelete:CASCADE;" json:"-"`
	User     *User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;" json:"-"`
}

// To enforce uniqueness (team_id, user_id) pair
func (TeamMembership) TableName() string {
	return "team_memberships"
}
