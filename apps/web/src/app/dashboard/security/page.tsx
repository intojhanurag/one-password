"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, KeyRound, Users, Eye, EyeOff, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import { apiService } from "@/lib/api"

interface APIKey {
  id: number
  name: string
  ownerId: number
  description?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

interface Team {
  id: number
  name: string
  description?: string
  ownerId: number
  createdAt: string
}

interface APIKeyTeam {
  id: number
  teamId: number
  apiKeyId: number
  createdAt: string
}

export default function SecurityPage() {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [apiKeyTeams, setApiKeyTeams] = useState<APIKeyTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedAPIKey, setSelectedAPIKey] = useState<APIKey | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    loadSecurityData()
  }, [router])

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      const [keysData, teamsData] = await Promise.all([
        apiService.listAPIKeys(),
        apiService.getTeamsDashboard()
      ])
      setApiKeys(keysData || [])
      setTeams(teamsData.teams || [])
    } catch (err: any) {
      setError(err.message || "Failed to load security data")
    } finally {
      setLoading(false)
    }
  }

  const loadTeamAPIKeys = async (teamId: number) => {
    try {
      const teamKeys = await apiService.listAPIKeyTeams(teamId)
      setApiKeyTeams(teamKeys || [])
    } catch (err: any) {
      setError(err.message || "Failed to load team API keys")
    }
  }

  const handleAttachAPIKey = async (teamId: number, apiKeyId: number) => {
    try {
      setError(null)
      await apiService.attachAPIKeyToTeam({ teamId, apiKeyId })
      loadTeamAPIKeys(teamId)
    } catch (err: any) {
      setError(err.message || "Failed to attach API key to team")
    }
  }

  const handleDetachAPIKey = async (teamId: number, apiKeyId: number) => {
    if (!confirm("Are you sure you want to remove this API key from the team?")) {
      return
    }

    try {
      setError(null)
      await apiService.detachAPIKeyFromTeam({ teamId, apiKeyId })
      loadTeamAPIKeys(teamId)
    } catch (err: any) {
      setError(err.message || "Failed to detach API key from team")
    }
  }

  const getSecurityScore = () => {
    const totalKeys = apiKeys.length
    const keysWithTeams = apiKeyTeams.length
    const keysWithoutTeams = totalKeys - keysWithTeams
    
    if (totalKeys === 0) return 100
    
    // Calculate score based on key distribution and team assignments
    const teamDistributionScore = keysWithTeams > 0 ? 80 : 60
    const keyCountScore = totalKeys > 5 ? 90 : 70
    
    return Math.round((teamDistributionScore + keyCountScore) / 2)
  }

  const getSecurityRecommendations = () => {
    const recommendations = []
    const totalKeys = apiKeys.length
    const keysWithTeams = apiKeyTeams.length

    if (totalKeys === 0) {
      recommendations.push("Create your first API key to get started")
    } else if (keysWithTeams === 0) {
      recommendations.push("Consider assigning API keys to teams for better access control")
    } else if (keysWithTeams < totalKeys) {
      recommendations.push("Some API keys are not assigned to teams - consider organizing them")
    }

    if (totalKeys > 10) {
      recommendations.push("You have many API keys - consider using tags to organize them better")
    }

    if (teams.length === 0) {
      recommendations.push("Create teams to better organize API key access")
    }

    return recommendations
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading security data...</p>
        </div>
      </div>
    )
  }

  const securityScore = getSecurityScore()
  const recommendations = getSecurityRecommendations()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage API key access and security settings
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <KeyRound className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total API Keys</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{apiKeys.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Teams</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* API Key Access Management */}
      <Card>
        <CardHeader>
          <CardTitle>API Key Access Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Team Selection */}
            <div>
              <Label htmlFor="team-select">Select Team</Label>
              <select
                id="team-select"
                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                value={selectedTeam?.id || ""}
                onChange={(e) => {
                  const teamId = parseInt(e.target.value)
                  const team = teams.find(t => t.id === teamId)
                  setSelectedTeam(team || null)
                  if (team) {
                    loadTeamAPIKeys(team.id)
                  }
                }}
              >
                <option value="">Choose a team...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTeam && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    API Keys assigned to {selectedTeam.name}
                  </h4>
                  {apiKeyTeams.length === 0 ? (
                    <p className="text-gray-500 text-sm">No API keys assigned to this team</p>
                  ) : (
                    <div className="space-y-2">
                      {apiKeyTeams.map((apiKeyTeam) => {
                        const apiKey = apiKeys.find(k => k.id === apiKeyTeam.apiKeyId)
                        return apiKey ? (
                          <div
                            key={apiKeyTeam.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{apiKey.name}</p>
                              {apiKey.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {apiKey.description}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDetachAPIKey(selectedTeam.id, apiKey.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : null
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Available API Keys to Assign
                  </h4>
                  <div className="space-y-2">
                    {apiKeys
                      .filter(apiKey => !apiKeyTeams.some(akt => akt.apiKeyId === apiKey.id))
                      .map((apiKey) => (
                        <div
                          key={apiKey.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{apiKey.name}</p>
                            {apiKey.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {apiKey.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAttachAPIKey(selectedTeam.id, apiKey.id)}
                          >
                            Assign
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
