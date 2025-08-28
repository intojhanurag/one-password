"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  User,
  Key,
  Users,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  Activity,
  MapPin,
  Monitor,
  Clock,
} from "lucide-react"
import type { AuditLog } from "@/lib/types"

interface AuditLogEntryProps {
  log: AuditLog
  showDetails?: boolean
  onViewDetails?: (log: AuditLog) => void
}

const actionIcons = {
  create: Plus,
  read: Eye,
  update: Edit,
  delete: Trash2,
  access: Shield,
}

const actionColors = {
  create: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  read: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  update: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  delete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  access: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

const resourceIcons = {
  api_key: Key,
  team: Users,
  user: User,
}

export function AuditLogEntry({ log, showDetails = false, onViewDetails }: AuditLogEntryProps) {
  const ActionIcon = actionIcons[log.action] || Activity
  const ResourceIcon = resourceIcons[log.resource_type] || Shield

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Card className="transition-all hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Action Icon */}
            <div className={`p-2 rounded-full ${actionColors[log.action]}`}>
              <ActionIcon className="h-4 w-4" />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  <ResourceIcon className="h-3 w-3 mr-1" />
                  {log.resource_type.replace("_", " ")}
                </Badge>
                <Badge className={`text-xs ${actionColors[log.action]}`}>{log.action}</Badge>
              </div>

              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {log.details?.name ? (
                  <>
                    {log.action} {log.resource_type.replace("_", " ")} "{log.details.name}"
                  </>
                ) : (
                  <>
                    {log.action} {log.resource_type.replace("_", " ")}
                  </>
                )}
              </p>

              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(log.created_at)}</span>
                </div>

                {log.ip_address && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{log.ip_address}</span>
                  </div>
                )}

                {log.user_agent && (
                  <div className="flex items-center space-x-1">
                    <Monitor className="h-3 w-3" />
                    <span className="truncate max-w-32">
                      {log.user_agent.includes("Chrome")
                        ? "Chrome"
                        : log.user_agent.includes("Firefox")
                          ? "Firefox"
                          : log.user_agent.includes("Safari")
                            ? "Safari"
                            : "Unknown"}
                    </span>
                  </div>
                )}
              </div>

              {showDetails && log.details && Object.keys(log.details).length > 0 && (
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {onViewDetails && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(log)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
