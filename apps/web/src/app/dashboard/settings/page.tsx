"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, User, Shield, LogOut, Save, AlertTriangle } from "lucide-react"

interface UserData {
  id: number
  email: string
  fullName: string
  createdAt: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: ""
  })

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (!token || !storedUser) {
      router.push("/auth/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setProfileForm({
        fullName: userData.fullName || "",
        email: userData.email || ""
      })
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Note: This would need a backend endpoint for profile updates
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local storage
      if (!user) {
        throw new Error("No user is loaded")
      }
      const updatedUser: UserData = {
        id: user.id,
        email: profileForm.email,
        fullName: profileForm.fullName,
        createdAt: user.createdAt,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setSuccess("Profile updated successfully!")
    } catch  {
      setError("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match")
      setSaving(false)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      setSaving(false)
      return
    }

    try {
      // Note: This would need a backend endpoint for password changes
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setSuccess("Password changed successfully!")
    } catch{
      setError( "Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-300 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/20 border-green-800">
          <Shield className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Your full name"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Shield className="h-5 w-5 mr-2" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Shield className="h-4 w-4 mr-2" />
                {saving ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Settings className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-300">User ID</Label>
                  <p className="text-white">{user?.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-300">Member Since</Label>
                  <p className="text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-800 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">Sign Out</h4>
                <p className="text-sm text-slate-300 mb-4">
                  Sign out of your account on this device
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  className="text-red-400 border-red-800 hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}