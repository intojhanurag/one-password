"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, Plus, Eye, EyeOff, Trash2, Copy, Shield, RefreshCw } from "lucide-react"
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

export default function APIKeysPage() {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [revealedKeys, setRevealedKeys] = useState<{ [key: string]: string }>({})
  const [copiedKeys, setCopiedKeys] = useState<{ [key: string]: boolean }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [revealing, setRevealing] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: "",
    key: "",
    description: "",
    tags: ""
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    loadAPIKeys()
  }, [router])

  const loadAPIKeys = async () => {
    try {
      setLoading(true)
      const keys = await apiService.listAPIKeys()
      setApiKeys(keys)
    } catch {
      setError("Failed to load API keys")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAPIKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (creating) return
    
    // Basic validation
    if (!createForm.name.trim()) {
      setError("API key name is required")
      return
    }
    if (!createForm.key.trim()) {
      setError("API key value is required")
      return
    }
    
    try {
      setError(null)
      setCreating(true)
      await apiService.createAPIKey(createForm)
      setCreateForm({ name: "", key: "", description: "", tags: "" })
      setShowCreateForm(false)
      setSuccessMessage("API key created successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      await loadAPIKeys()
    } catch {
      setError("Failed to create API key")
    } finally {
      setCreating(false)
    }
  }

  const handleRevealKey = async (name: string) => {
    if (revealing === name) return
    
    try {
      setError(null)
      setRevealing(name)
      const revealedKey = await apiService.revealAPIKey(name)
      const hasKeyProp = (value: unknown): value is { key: unknown } =>
        typeof value === 'object' && value !== null && 'key' in value
      let keyValue = ''
      if (typeof revealedKey === 'string') {
        keyValue = revealedKey
      } else if (hasKeyProp(revealedKey) && typeof revealedKey.key === 'string') {
        keyValue = revealedKey.key
      }
      if (keyValue) setRevealedKeys(prev => ({ ...prev, [name]: keyValue }))
    } catch {
      setError("Failed to reveal API key")
    } finally {
      setRevealing(null)
    }
  }

  const handleCopyKey = async (key: string, name: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKeys(prev => ({ ...prev, [name]: true }))
      setTimeout(() => {
        setCopiedKeys(prev => ({ ...prev, [name]: false }))
      }, 2000)
    } catch{
      setError("Failed to copy to clipboard")
    }
  }

  const handleDeleteKey = async (name: string) => {
    if (deleting === name) return
    
    if (!confirm(`Are you sure you want to delete the API key "${name}"?`)) {
      return
    }

    try {
      setError(null)
      setDeleting(name)
      await apiService.deleteAPIKey(name)
      await loadAPIKeys()
    } catch{
      setError("Failed to delete API key")
    } finally {
      setDeleting(null)
    }
  }

  const filteredKeys = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return apiKeys
    return apiKeys.filter(k => {
      const fields = [
        k.name,
        k.description || "",
        k.tags || "",
        new Date(k.createdAt).toLocaleDateString(),
      ].join(" ").toLowerCase()
      return fields.includes(q)
    })
  }, [apiKeys, searchQuery])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading API keys...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Keys</h1>
          <p className="text-slate-300 mt-1">
            Manage your API keys securely
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={loadAPIKeys} 
            disabled={loading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search API keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-900/20 border-green-800">
          <Shield className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add New API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAPIKey} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My API Key"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key">API Key *</Label>
                  <Input
                    id="key"
                    value={createForm.key}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="sk-..."
                    required
                  />
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={createForm.tags}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="production, api, external"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create API Key"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} disabled={creating}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      {filteredKeys.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <KeyRound className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-white mb-2">
              {apiKeys.length === 0 ? "No API Keys Yet" : "No Results Found"}
            </h3>
            <p className="text-slate-300 mb-4">
              {apiKeys.length === 0 
                ? "Get started by adding your first API key"
                : "Try adjusting your search terms"
              }
            </p>
            {apiKeys.length === 0 && (
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First API Key
                </Button>
                <div className="text-sm text-slate-400">
                  <p>• Store API keys securely with encryption</p>
                  <p>• Organize with tags and descriptions</p>
                  <p>• Share with team members</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredKeys.map((apiKey) => (
            <Card key={apiKey.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <KeyRound className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-medium text-white">
                        {apiKey.name}
                      </h3>
                    </div>
                    {apiKey.description && (
                      <p className="text-slate-300 mb-2">
                        {apiKey.description}
                      </p>
                    )}
                    {apiKey.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {apiKey.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-slate-400">
                      Created {new Date(apiKey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevealKey(apiKey.name)}
                      disabled={revealing === apiKey.name}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      {revealing === apiKey.name ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-300"></div>
                      ) : revealedKeys[apiKey.name] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    {revealedKeys[apiKey.name] && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyKey(revealedKeys[apiKey.name], apiKey.name)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        {copiedKeys[apiKey.name] ? (
                          "Copied!"
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteKey(apiKey.name)}
                      disabled={deleting === apiKey.name}
                      className="text-red-400 border-red-800 hover:bg-red-900/20 disabled:opacity-50"
                    >
                      {deleting === apiKey.name ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {revealedKeys[apiKey.name] && (
                  <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                    <p className="text-sm font-mono break-all text-white">
                      {revealedKeys[apiKey.name]}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
