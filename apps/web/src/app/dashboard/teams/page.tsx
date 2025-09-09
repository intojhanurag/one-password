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
      setError(null)
      
      // Try to load teams data with better error handling
      const teamsData = await apiService.getTeamsDashboard()
      
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
      
      // Try to load team memberships, but don't fail if it doesn't work
      try {
        const membershipsData = await apiService.listTeamMemberships()
        setTeamMemberships(membershipsData || [])
      } catch (membershipError) {
        console.warn("Failed to load team memberships:", membershipError)
        setTeamMemberships([])
      }
    } catch (err: any) {
      console.error("Teams data error:", err)
      setError(err.message || "Failed to load teams data")
      // Set empty arrays to prevent further errors
      setTeams([])
      setTeamMemberships([])
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
          <p className="text-slate-300">Loading teams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Teams</h1>
          <p className="text-slate-300 mt-1">
            Manage your teams and memberships
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {/* Create Team Form */}
      {showCreateForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Create New Team</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Team Name *</Label>
                <Input
                  id="name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Team"
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Input
                  id="description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Create Team
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Teams List */}
      {teams.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Teams Yet
            </h3>
            <p className="text-slate-300 mb-4">
              Create your first team to start collaborating
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
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
              <Card key={team.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      <CardTitle className="text-xl text-white">{team.name}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTeam(team)
                          loadTeamAPIKeys(team.id)
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <KeyRound className="h-4 w-4 mr-2" />
                        Manage API Keys
                      </Button>
                    </div>
                  </div>
                  {team.description && (
                    <p className="text-slate-300">{team.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Team Members */}
                    <div>
                      <h4 className="font-medium text-white mb-2">
                        Team Members ({teamMembers.length})
                      </h4>
                      {teamMembers.length === 0 ? (
                        <p className="text-slate-400 text-sm">No members yet</p>
                      ) : (
                        <div className="space-y-2">
                          {teamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-2 bg-slate-700 rounded-lg"
                            >
                              <div>
                                <p className="text-sm font-medium text-white">User ID: {member.userId}</p>
                                <p className="text-xs text-slate-400">
                                  Status: {member.status} • Joined {new Date(member.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMember(team.id, member.userId)}
                                className="text-red-400 hover:text-red-300 border-red-800 hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Member Form */}
                    <div className="border-t border-slate-700 pt-4">
                      <h4 className="font-medium text-white mb-2">
                        Add Team Member
                      </h4>
                      <form onSubmit={handleAddMember} className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="User ID"
                          value={membershipForm.userId}
                          onChange={(e) => setMembershipForm({ userId: e.target.value })}
                          className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        />
                        <Button 
                          type="submit" 
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
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