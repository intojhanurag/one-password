package models

type ActivitySummary struct {
	TotalActions     int64   `json:"totalAcions"`
	TodaysActivity   int64   `json:"todaysActivity"`
	ActiveUsers      int64   `json:"activeUsers"`
	SecurityEvents   int64   `json:"securityEvents"`
}


type ActivityDashboard struct {
	Summary  ActivitySummary  `json:"summary"`
	Records  []Activity        `json:"records"`
}