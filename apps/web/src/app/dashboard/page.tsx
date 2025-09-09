"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound, Users, Shield, Activity, TrendingUp, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { apiService } from "@/lib/api"

type APIKey = {
  id: number
  name: string
  ownerId: number
  description?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

type DashboardData = {
  totalApiKeys: number
  totalTeams: number
  securityPercent: number
  activitiesThisWeek: number
  recentApiKeys: APIKey[]
  recentlyUsedKeys: APIKey[]
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null)
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/auth/login");
      return;
    }

    apiService.getDashboard()
      .then(setData)
      .catch((error) => {
        console.error("Dashboard fetch error:", error);
        router.push("/auth/login");
      })
      .finally(() => setLoading(false));
  }, [router])

  if(loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <KeyRound className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Loading Dashboard</h3>
        <p className="text-slate-300">Fetching your API keys and team data...</p>
      </div>
    </div>
  )

  if(!data) return null
  
  const { totalApiKeys, totalTeams, securityPercent, activitiesThisWeek, recentApiKeys, recentlyUsedKeys } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back 
        </h1>
        <p className="text-slate-300 mt-2">Here's what's happening with your API keys and teams</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">API Keys</CardTitle>
            <KeyRound className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalApiKeys || 0}</div>
            <p className="text-xs text-slate-400">
              {totalApiKeys === 0 ? "No keys stored yet" : "Total stored keys"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Teams</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTeams || 0}</div>
            <p className="text-xs text-slate-400">
              {totalTeams === 0 ? "No teams joined" : "Teams you're part of"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Security</CardTitle>
            <Shield className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{securityPercent}%</div>
            <p className="text-xs text-slate-400">All keys encrypted</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Activity</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activitiesThisWeek || 0}</div>
            <p className="text-xs text-slate-400">Actions this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent API Keys */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <KeyRound className="h-5 w-5 text-blue-400" />
              <span>Recent API Keys</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentApiKeys && recentApiKeys.length > 0 ? (
              <div className="space-y-3">
                {recentApiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm text-white">{key.name}</p>
                      <p className="text-xs text-slate-400">Created</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-slate-400">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <KeyRound className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No API keys yet</p>
                <p className="text-sm">Add your first API key to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Activity className="h-5 w-5 text-blue-400" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentlyUsedKeys && recentlyUsedKeys.length > 0 ? (
              <div className="space-y-3">
                {recentlyUsedKeys.map((key) => (
                  <div key={key.id} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                    <div className="flex-shrink-0">
                      <Activity className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">Accessed {key.name}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(key.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Your actions will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}