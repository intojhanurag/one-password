"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, KeyRound, Users, Shield, TrendingUp } from "lucide-react"
import { apiService } from "@/lib/api"

interface ActivityItem {
  id: number
  userId: number
  type: string
  entity: string
  entityId: number
  message: string
  createdAt: string
}

interface ActivityStats {
  totalActivities: number
  activitiesThisWeek: number
  activitiesThisMonth: number
  mostActiveDay: string
  activityTypes: { [key: string]: number }
}

export default function ActivityPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    loadActivityData()
  }, [router])

  const loadActivityData = async () => {
    try {
      setLoading(true)
      const [activitiesData, statsData] = await Promise.all([
        apiService.listActivities(),
        apiService.getActivityStats()
      ])
      setActivities(activitiesData || [])
      setStats(statsData || null)
    } catch (err: any) {
      setError(err.message || "Failed to load activity data")
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'apikey_created':
      case 'apikey_updated':
      case 'apikey_deleted':
        return <KeyRound className="h-4 w-4 text-blue-400" />
      case 'team_created':
      case 'team_updated':
      case 'team_deleted':
        return <Users className="h-4 w-4 text-green-400" />
      case 'member_added':
      case 'member_removed':
        return <Users className="h-4 w-4 text-purple-400" />
      default:
        return <Activity className="h-4 w-4 text-slate-400" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'apikey_created':
        return 'bg-green-900/30 text-green-300'
      case 'apikey_deleted':
        return 'bg-red-900/30 text-red-300'
      case 'team_created':
        return 'bg-blue-900/30 text-blue-300'
      case 'member_added':
        return 'bg-purple-900/30 text-purple-300'
      default:
        return 'bg-slate-700 text-slate-300'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading activity...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Activity</h1>
        <p className="text-slate-300 mt-1">
          Track your API key and team management activities
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-300">Total Activities</p>
                  <p className="text-2xl font-bold text-white">{stats.totalActivities}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-300">This Week</p>
                  <p className="text-2xl font-bold text-white">{stats.activitiesThisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-300">This Month</p>
                  <p className="text-2xl font-bold text-white">{stats.activitiesThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-orange-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-300">Most Active Day</p>
                  <p className="text-2xl font-bold text-white">{stats.mostActiveDay}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Types Breakdown */}
      {stats && stats.activityTypes && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Activity Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.activityTypes).map(([type, count]) => (
                <div key={type} className="text-center p-4 bg-slate-700 rounded-lg">
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-sm text-slate-300 capitalize">
                    {type.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activities */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-white mb-2">
                No Activities Yet
              </h3>
              <p className="text-slate-300">
                Your activities will appear here as you use the system
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-4 bg-slate-700 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">
                        {activity.message}
                      </p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityColor(activity.type)}`}>
                        {activity.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-xs text-slate-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}