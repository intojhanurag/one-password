import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound, Shield, Users, Zap, ArrowRight, Lock, Eye, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <KeyRound className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">API Key Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Secure API Key Management
            <span className="text-blue-600"> Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Store, organize, and share your API keys securely with your team. Enterprise-grade encryption with an
            intuitive interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to manage API keys
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built for developers and teams who need secure, scalable API key management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg w-fit">
                  <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>End-to-End Encryption</CardTitle>
                <CardDescription>
                  Your API keys are encrypted before storage and never stored in plain text
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg w-fit">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>Share API keys securely with team members with granular permissions</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg w-fit">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Audit Logging</CardTitle>
                <CardDescription>Complete audit trail of who accessed what keys and when</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg w-fit">
                  <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>
                  Organize keys by service, environment, and custom tags for easy retrieval
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg w-fit">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  Control who can view, edit, or manage API keys with flexible role system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg w-fit">
                  <Globe className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>Programmatic access to your keys through our secure REST API</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to secure your API keys?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of developers who trust us with their most sensitive credentials
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/auth/signup">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1 rounded">
                <KeyRound className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                © 2024 API Key Manager. Built with security in mind.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
