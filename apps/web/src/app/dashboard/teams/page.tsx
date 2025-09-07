"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, UserPlus, Trash2, Shield, KeyRound } from "lucide-react"
import { apiService, type APIKeyTeam } from "@/lib/api"

interface Team {
  id: number
  name: string
  description?: string
  ownerId: number
  createdAt: string
  updatedAt: string
}

interface TeamMembership {
  id: number
  teamId: number
  userId: number
  status: string
  createdAt: string
}

// Using APIKeyTeam type from API layer

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [teamMemberships, setTeamMemberships] = useState<TeamMembership[]>([])
  const [apiKeyTeams, setApiKeyTeams] = useState<APIKeyTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: "",
    description: ""
  })

  // Team membership form state
  const [membershipForm, setMembershipForm] = useState({
    userId: ""
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    loadTeamsData()
  }, [router])

  const loadTeamsData = async () => {
    try {
      setLoading(true)
      const [teamsData, membershipsData] = await Promise.all([
        apiService.getTeamsDashboard(),
        apiService.listTeamMemberships()
      ])
      // Backend returns teamsOwned array; normalize to Team[]
      const normalizedTeams: Team[] = (teamsData.teamsOwned || []).map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        ownerId: 0,
        createdAt: t.createdAt,
        updatedAt: t.createdAt,
      }))
      setTeams(normalizedTeams)
      setTeamMemberships(membershipsData || [])
    } catch (err: any) {
      setError(err.message || "Failed to load teams data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      await apiService.createTeam(createForm)
      setCreateForm({ name: "", description: "" })
      setShowCreateForm(false)
      loadTeamsData()
    } catch (err: any) {
      setError(err.message || "Failed to create team")
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return

    try {
      setError(null)
      await apiService.createTeamMembership({
        teamId: selectedTeam.id,
        userId: parseInt(membershipForm.userId)
      })
      setMembershipForm({ userId: "" })
      loadTeamsData()
    } catch (err: any) {
      setError(err.message || "Failed to add team member")
    }
  }

  const handleRemoveMember = async (teamId: number, userId: number) => {
    if (!confirm("Are you sure you want to remove this team member?")) {
      return
    }

    try {
      await apiService.deleteTeamMembership({ teamId, userId })
      loadTeamsData()
    } catch (err: any) {
      setError(err.message || "Failed to remove team member")
    }
  }

  const loadTeamAPIKeys = async (teamId: number) => {
    try {
      const apiKeys = await apiService.listAPIKeyTeams(teamId)
      setApiKeyTeams(apiKeys ?? [])
    } catch (err: any) {
      setError(err.message || "Failed to load team API keys")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your teams and memberships
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Create Team Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Team</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Team"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Create Team</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Teams List */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Teams Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first team to start collaborating
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {teams.map((team) => {
            const teamMembers = teamMemberships.filter(m => m.teamId === team.id)
            return (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-xl">{team.name}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTeam(team)
                          loadTeamAPIKeys(team.id)
                        }}
                      >
                        <KeyRound className="h-4 w-4 mr-2" />
                        Manage API Keys
                      </Button>
                    </div>
                  </div>
                  {team.description && (
                    <p className="text-gray-600 dark:text-gray-400">{team.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Team Members */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Team Members ({teamMembers.length})
                      </h4>
                      {teamMembers.length === 0 ? (
                        <p className="text-gray-500 text-sm">No members yet</p>
                      ) : (
                        <div className="space-y-2">
                          {teamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div>
                                <p className="text-sm font-medium">User ID: {member.userId}</p>
                                <p className="text-xs text-gray-500">
                                  Status: {member.status} • Joined {new Date(member.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMember(team.id, member.userId)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Member Form */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Add Team Member
                      </h4>
                      <form onSubmit={handleAddMember} className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="User ID"
                          value={membershipForm.userId}
                          onChange={(e) => setMembershipForm({ userId: e.target.value })}
                          className="flex-1"
                        />
                        <Button type="submit" size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
