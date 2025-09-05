package services

import (
    "time"

    "gorm.io/gorm"
    "github.com/intojhanurag/One-Password/apps/api/internals/models"
	"github.com/intojhanurag/One-Password/apps/api/internals/repository"

)

type DashboardData struct {
    TotalAPIKeys      int64          `json:"totalApiKeys"`
    TotalTeams        int64          `json:"totalTeams"`
    SecurityPercent   float64        `json:"securityPercent"`
    ActivitiesThisWeek int64         `json:"activitiesThisWeek"`
    RecentAPIKeys     []models.APIKey `json:"recentApiKeys"`
    RecentlyUsedKeys  []models.APIKey `json:"recentlyUsedKeys"`
}

type DashboardService struct {
    db          *gorm.DB
    apiKeyRepo  repository.APIKeyRepository
    teamRepo    repository.TeamRepository
    activityRepo repository.ActivityRepository
}

func NewDashboardService(db *gorm.DB, akRepo repository.APIKeyRepository, teamRepo repository.TeamRepository, activityRepo repository.ActivityRepository) *DashboardService {
    return &DashboardService{db: db, apiKeyRepo: akRepo, teamRepo: teamRepo, activityRepo: activityRepo}
}

func (s *DashboardService) GetDashboard(userID uint) (*DashboardData, error) {
    var totalKeys int64
    s.db.Model(&models.APIKey{}).Where("owner_id = ?", userID).Count(&totalKeys)

    var totalTeams int64
    s.db.Model(&models.Team{}).Where("owner_id = ?", userID).Count(&totalTeams)

    // Security % → always 100
    securityPercent := 100.0

    // Activities in last 7 days
    weekAgo := time.Now().AddDate(0, 0, -7)
    var activities int64
    s.db.Model(&models.Activity{}).
        Where("user_id = ? AND created_at >= ?", userID, weekAgo).
        Count(&activities)

    // Recent API keys (latest 5 created)
    var recentKeys []models.APIKey
    s.db.Where("owner_id = ?", userID).
        Order("created_at desc").
        Limit(5).Find(&recentKeys)

    // Recently used keys (based on Activity logs)
    var usedKeys []models.APIKey
    s.db.Joins("JOIN activities ON activities.api_key_id = api_keys.id").
        Where("api_keys.owner_id = ?", userID).
        Order("activities.created_at desc").
        Limit(5).
        Find(&usedKeys)

    return &DashboardData{
        TotalAPIKeys:      totalKeys,
        TotalTeams:        totalTeams,
        SecurityPercent:   securityPercent,
        ActivitiesThisWeek: activities,
        RecentAPIKeys:     recentKeys,
        RecentlyUsedKeys:  usedKeys,
    }, nil
}


// services/dashboard_service.go
func (s *DashboardService) GetTeamDashboard(userID uint) (map[string]interface{}, error) {
    // Total Teams (where user is a member)
    var totalTeams int64
    if err := s.db.Model(&models.TeamMembership{}).
        Where("user_id = ?", userID).
        Count(&totalTeams).Error; err != nil {
        return nil, err
    }
    
    // Teams Owned
    var teamsOwned []models.Team
    if err := s.db.Where("owner_id = ?", userID).Find(&teamsOwned).Error; err != nil {
        return nil, err
    }
    teamsOwnedCount := len(teamsOwned)

    // Total Members across all owned teams
    var totalMembers int64
    if err := s.db.Model(&models.TeamMembership{}).
        Where("team_id IN (?)", s.db.Model(&models.Team{}).Select("id").Where("owner_id = ?", userID)).
        Count(&totalMembers).Error; err != nil {
        return nil, err
    }

    // Shared Keys (API keys that belong to teams the user owns)
    var sharedKeys int64
    if err := s.db.Model(&models.APIKeyTeam{}).
        Where("team_id IN (?)", s.db.Model(&models.Team{}).Select("id").Where("owner_id = ?", userID)).
        Count(&sharedKeys).Error; err != nil {
        return nil, err
    }

    // Prepare teams data
    teamsOwnedData := []map[string]interface{}{}
    for _, team := range teamsOwned {
        teamsOwnedData = append(teamsOwnedData, map[string]interface{}{
            "id":          team.ID,
            "name":        team.Name,
            "description": team.Description,
            "createdAt":   team.CreatedAt,
        })
    }

    return map[string]interface{}{
        "totalTeams":     totalTeams,
        "teamsOwnedCount": teamsOwnedCount,
        "totalMembers":   totalMembers,
        "sharedKeys":     sharedKeys,
        "teamsOwned":     teamsOwnedData,
    }, nil
}
