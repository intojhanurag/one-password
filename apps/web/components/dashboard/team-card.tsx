"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, Crown, Shield, Eye, MoreHorizontal, Settings, UserPlus, LogOut } from "lucide-react"

interface Team {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  member_count: number
  api_key_count: number
  user_role: "owner" | "admin" | "member" | "viewer"
}

interface TeamCardProps {
  team: Team
  onManage: (team: Team) => void
  onLeave: (team: Team) => void
  onInvite: (team: Team) => void
}

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: Users,
  viewer: Eye,
}

const roleColors = {
  owner: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  member: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  viewer: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export function TeamCard({ team, onManage, onLeave, onInvite }: TeamCardProps) {
  const RoleIcon = roleIcons[team.user_role]
  const canManage = team.user_role === "owner" || team.user_role === "admin"
  const canInvite = team.user_role === "owner" || team.user_role === "admin"

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{team.name}</CardTitle>
            {team.description && <p className="text-sm text-muted-foreground">{team.description}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canManage && (
                <DropdownMenuItem onClick={() => onManage(team)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Team
                </DropdownMenuItem>
              )}
              {canInvite && (
                <DropdownMenuItem onClick={() => onInvite(team)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Members
                </DropdownMenuItem>
              )}
              {team.user_role !== "owner" && (
                <DropdownMenuItem onClick={() => onLeave(team)} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Team
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role Badge */}
        <div className="flex items-center justify-between">
          <Badge className={`${roleColors[team.user_role]} flex items-center space-x-1`}>
            <RoleIcon className="h-3 w-3" />
            <span className="capitalize">{team.user_role}</span>
          </Badge>
          <div className="text-xs text-muted-foreground">Created {new Date(team.created_at).toLocaleDateString()}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-lg font-semibold">{team.member_count}</div>
            <div className="text-xs text-muted-foreground">Members</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-lg font-semibold">{team.api_key_count}</div>
            <div className="text-xs text-muted-foreground">API Keys</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onManage(team)} className="flex-1 bg-transparent">
            <Users className="h-4 w-4 mr-2" />
            View Team
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
