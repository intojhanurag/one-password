"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { KeyRound, Users, Settings, Activity, Plus, Menu, X, Shield, Home, LogOut } from "lucide-react"

import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "API Keys", href: "/dashboard/keys", icon: KeyRound },
  { name: "Teams", href: "/dashboard/teams", icon: Users },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "Security", href: "/dashboard/security", icon: Shield },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

type User = { id: number; fullName: string; email: string } | null

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut=()=>{
    localStorage.removeItem("token")
    router.push("/auth/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white dark:bg-gray-800"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-slate-700">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-lg">
              <KeyRound className="h-6 w-6 text-black" />
            </div>
            <span className="ml-3 text-lg font-semibold text-white">One-Password</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-900/30 text-blue-300"
                      : "text-slate-300 hover:bg-slate-700",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-4 border-t border-slate-700">
            <Button asChild className="w-full mb-3">
              <Link href="/dashboard/keys">
                <Plus className="h-4 w-4 mr-2" />
                Add API Key
              </Link>
            </Button>
          </div>

          {/* User Profile */}
          <div className="px-4 py-4 border-t border-slate-700">
            <div className="flex items-center mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
                <span className="text-sm font-medium text-white">
                  {(user?.fullName?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.fullName || user?.email || "User"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
