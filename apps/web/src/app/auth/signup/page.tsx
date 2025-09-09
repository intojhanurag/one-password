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
import { apiService } from "@/lib/api"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
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
          <p className="text-slate-300 mt-2">Create your secure account</p>
        </div>

        <Card className="shadow-xl bg-slate-800 border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-slate-300">Sign up to start managing your API keys securely</CardDescription>
          </CardHeader>
          <CardContent>
            <form  
                className="space-y-4"
                onSubmit={async(e)=>{
                    e.preventDefault();
                    setError(null);
                    setIsLoading(true);

                    if(password !== confirmPassword){
                        setError("Passwords do not match");
                        setIsLoading(false);
                        return;
                    }
                    try {
                        const data = await apiService.signup({ fullName, email, password });
                        
                        // Store token and redirect to dashboard
                        localStorage.setItem("token", data.token);
                        const { token, ...user } = data;
                        localStorage.setItem("user", JSON.stringify(user));
                        router.push("/dashboard");
                    } catch (err: any) {
                        setError(err.message || "Signup failed");
                    } finally {
                        setIsLoading(false);
                    }
                }}
            >

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
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
                  placeholder="At least 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-400">Already have an account? </span>
              <Link href="/auth/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}