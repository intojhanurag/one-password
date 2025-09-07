"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, Plus, Eye, EyeOff, Trash2, Copy, Shield } from "lucide-react"
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
    } catch (err: any) {
      setError(err.message || "Failed to load API keys")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAPIKey = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      await apiService.createAPIKey(createForm)
      setCreateForm({ name: "", key: "", description: "", tags: "" })
      setShowCreateForm(false)
      loadAPIKeys()
    } catch (err: any) {
      setError(err.message || "Failed to create API key")
    }
  }

  const handleRevealKey = async (name: string) => {
    try {
      const revealedKey = await apiService.revealAPIKey(name)
      setRevealedKeys(prev => ({ ...prev, [name]: revealedKey }))
    } catch (err: any) {
      setError(err.message || "Failed to reveal API key")
    }
  }

  const handleCopyKey = async (key: string, name: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKeys(prev => ({ ...prev, [name]: true }))
      setTimeout(() => {
        setCopiedKeys(prev => ({ ...prev, [name]: false }))
      }, 2000)
    } catch (err) {
      setError("Failed to copy to clipboard")
    }
  }

  const handleDeleteKey = async (name: string) => {
    if (!confirm(`Are you sure you want to delete the API key "${name}"?`)) {
      return
    }

    try {
      await apiService.deleteAPIKey(name)
      loadAPIKeys()
    } catch (err: any) {
      setError(err.message || "Failed to delete API key")
    }
  }

  const filteredKeys = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
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
  }, [apiKeys, deferredQuery])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API keys...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Keys</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your API keys securely
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add API Key
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New API Key</CardTitle>
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
                <Button type="submit">Create API Key</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <KeyRound className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No API Keys Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by adding your first API key
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <KeyRound className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {apiKey.name}
                      </h3>
                    </div>
                    {apiKey.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {apiKey.description}
                      </p>
                    )}
                    {apiKey.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {apiKey.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      Created {new Date(apiKey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevealKey(apiKey.name)}
                    >
                      {revealedKeys[apiKey.name] ? (
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
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {revealedKeys[apiKey.name] && (
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-mono break-all">
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
