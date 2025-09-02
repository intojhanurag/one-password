package models

import "time"

type Membership struct {
	id             SERIAL PRIMARY KEY,
	user_id        INT REFERENCES users(id) ON DELETE CASCADE,
	status         VARCHAR(50) DEFAULT 'active', -- active | expired | canceled
	started_at     TIMESTAMP DEFAULT NOW(),
	expires_at     TIMESTAMP,  -- if one-time, can be null or set far in future
	UNIQUE(user_id) -- one subscription per user
}