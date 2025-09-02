package models
import "time"


team_memberships (
  id             SERIAL PRIMARY KEY,
  team_id        INT REFERENCES teams(id) ON DELETE CASCADE,
  user_id        INT REFERENCES users(id) ON DELETE CASCADE,
  role           VARCHAR(50) DEFAULT 'member', -- "owner" | "admin" | "member"
  created_at     time.Time,
  UNIQUE(team_id, user_id)
);
