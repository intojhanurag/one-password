"use client"

import { PremiumButton } from "@/components/ui/premium-button"
import { KeyRound, Shield, Zap, Star,Lock, ArrowRight, Award, Gift } from "lucide-react"

export function HeroSection() {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-lg">
              <KeyRound className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">One-Password</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
  
            <a href="/auth/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Sign In
            </a>
            <PremiumButton size="sm" href="/auth/signup">
              Get Started
            </PremiumButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Main Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-2">
              <Award className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-slate-300">Product of the day</span>
              <span className="text-sm font-semibold text-yellow-400">2nd</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Ship your API keys
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  securely, not carelessly
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                The NextJS boilerplate with enterprise-grade security for managing API keys. 
                Store, organize, and share your most sensitive credentials with military-grade encryption.
              </p>
            </div>

            {/* CTA Section */}
            <div className="space-y-6">
              <PremiumButton size="xl" href="/auth/signup" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600">
                <Zap className="h-5 w-5 mr-2" />
                Get One-Password
              </PremiumButton>

              {/* Special Offer */}
              <div className="flex items-center space-x-3 text-green-400">
                <Gift className="h-5 w-5" />
                <span className="text-sm">
                  $100 off for the first 1000 customers (847 left)
                </span>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-slate-900 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{i}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-slate-400 ml-2">4.9/5 from 1,200+ developers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Technology Showcase */}
          <div className="relative">
            {/* Central Node */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <KeyRound className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Technology Nodes */}
            <div className="relative h-96">
              {/* Next.js - Top */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-black rounded text-white flex items-center justify-center text-xs font-bold">N</div>
                    <span className="text-white font-semibold">Next.js</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>App Router</div>
                    <div>Server Components</div>
                  </div>
                </div>
              </div>

              {/* Tailwind - Top Right */}
              <div className="absolute top-8 right-8">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-white">T</span>
                    </div>
                    <span className="text-white font-semibold">Tailwind</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Components</div>
                    <div>Animations</div>
                  </div>
                </div>
              </div>

              {/* Stripe - Right */}
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-white">S</span>
                    </div>
                    <span className="text-white font-semibold">Stripe</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Webhooks</div>
                    <div>Checkout</div>
                  </div>
                </div>
              </div>

              {/* Auth - Bottom Right */}
              <div className="absolute bottom-8 right-8">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-white font-semibold">NextAuth</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Google Login</div>
                    <div>Magic Link</div>
                  </div>
                </div>
              </div>

              {/* Database - Bottom */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-white">P</span>
                    </div>
                    <span className="text-white font-semibold">PostgreSQL</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Encryption</div>
                    <div>Backups</div>
                  </div>
                </div>
              </div>

              {/* Go Backend - Left */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-cyan-400 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-black">G</span>
                    </div>
                    <span className="text-white font-semibold">Go</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>High Performance</div>
                    <div>Concurrency</div>
                  </div>
                </div>
              </div>

              {/* Security - Top Left */}
              <div className="absolute top-8 left-8">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                      <Lock className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-white font-semibold">AES-256</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Encryption</div>
                    <div>Zero Trust</div>
                  </div>
                </div>
              </div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                {/* Lines connecting to center */}
                <line x1="50%" y1="0%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
                <line x1="50%" y1="50%" x2="100%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
                <line x1="50%" y1="50%" x2="0%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
                <line x1="50%" y1="50%" x2="50%" y2="100%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
                <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
                <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
                <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
                <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.3" />
              </svg>
            </div>

            {/* Bottom Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                + all the boring stuff (SEO tags, API calls, customer support)
              </p>
              <div className="flex justify-center mt-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <ArrowRight className="h-4 w-4 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}