"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { UserPlus, X, Plus, Mail } from "lucide-react"

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
  teamName: string
  onSuccess: () => void
}

interface Invitation {
  email: string
  role: "admin" | "member" | "viewer"
}

export function InviteMemberDialog({ open, onOpenChange, teamId, teamName, onSuccess }: InviteMemberDialogProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState<"admin" | "member" | "viewer">("member")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addInvitation = () => {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    if (invitations.some((inv) => inv.email === newEmail.trim())) {
      setError("This email is already in the invitation list")
      return
    }

    setInvitations([...invitations, { email: newEmail.trim(), role: newRole }])
    setNewEmail("")
    setError(null)
  }

  const removeInvitation = (email: string) => {
    setInvitations(invitations.filter((inv) => inv.email !== email))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (invitations.length === 0) {
      setError("Please add at least one invitation")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/teams/${teamId}/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitations }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send invitations")
      }

      // Reset form
      setInvitations([])
      setNewEmail("")
      setNewRole("member")
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newEmail.trim()) {
      e.preventDefault()
      addInvitation()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Invite Members to {teamName}</span>
          </DialogTitle>
          <DialogDescription>
            Send invitations to collaborate on API keys. Members will receive an email invitation to join your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Add New Invitation */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addInvitation}
              disabled={!newEmail.trim()}
              className="bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Invitation
            </Button>
          </div>

          {/* Invitation List */}
          {invitations.length > 0 && (
            <div className="space-y-2">
              <Label>Pending Invitations ({invitations.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.email}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{invitation.email}</span>
                      <Badge variant="outline" className="text-xs">
                        {invitation.role}
                      </Badge>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeInvitation(invitation.email)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role Descriptions */}
          <div className="space-y-2">
            <Label>Role Permissions</Label>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                • <strong>Viewer:</strong> Can view team API keys but cannot modify them
              </div>
              <div>
                • <strong>Member:</strong> Can view, create, and edit API keys
              </div>
              <div>
                • <strong>Admin:</strong> Can manage team members and all API keys
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || invitations.length === 0}>
              {isLoading ? "Sending..." : `Send ${invitations.length} Invitation${invitations.length !== 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
