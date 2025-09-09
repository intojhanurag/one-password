"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { KeyRound, Shield, ArrowLeft } from "lucide-react"
import { apiService, type LoginResponse } from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-xl">
              <KeyRound className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">One-Password</h1>
          <p className="text-slate-300 mt-2">Secure storage for your API keys</p>
        </div>

        <Card className="shadow-xl bg-slate-800 border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-300">Enter your credentials to access your API keys</CardDescription>
          </CardHeader>
          <CardContent>
            <form 
                className="space-y-4"
                onSubmit={async(e)=>{
                     e.preventDefault();
                    setError(null);
                    setIsLoading(true);
                    try {
                        const data: LoginResponse = await apiService.login({ email, password });
                        
                        // Store token and user data
                        localStorage.setItem("token", data.token);
                        const { token, ...user } = data;
                        localStorage.setItem("user", JSON.stringify(user));
                        
                        router.push("/dashboard");
                    } catch (err: any) {
                        setError(err.message || "Login failed");
                    } finally {
                        setIsLoading(false);
                    }
                }}
                
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-400">Don't have an account? </span>
              <Link href="/auth/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}