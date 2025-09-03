package models

import "time"

type Membership struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    UserID    uint      `gorm:"not null;unique;index" json:"user_id"`
    Status    string    `gorm:"type:varchar(50);default:'active'" json:"status"`
    StartedAt time.Time `gorm:"autoCreateTime" json:"started_at"`

    User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;" json:"-"`
}
