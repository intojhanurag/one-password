"use client"

import { PremiumCard } from "@/components/ui/premium-card"
import { Lock, Users, Eye, Zap, Shield, Globe, ArrowRight, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Lock,
    title: "Military-Grade Encryption",
    description: "Your API keys are encrypted with AES-256 encryption before storage and never stored in plain text.",
    iconColor: "text-red-400",
    gradient: "from-red-500/20 to-pink-500/20"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share API keys securely with team members with granular permissions and role-based access control.",
    iconColor: "text-green-400",
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: Eye,
    title: "Complete Audit Trail",
    description: "Track every access, modification, and sharing event with detailed audit logs and real-time monitoring.",
    iconColor: "text-purple-400",
    gradient: "from-purple-500/20 to-violet-500/20"
  },
  {
    icon: Zap,
    title: "Lightning Fast Access",
    description: "Organize keys by service, environment, and custom tags for instant retrieval and seamless integration.",
    iconColor: "text-orange-400",
    gradient: "from-orange-500/20 to-amber-500/20"
  },
  {
    icon: Shield,
    title: "Zero-Trust Architecture",
    description: "Implement zero-trust security principles with multi-factor authentication and least-privilege access.",
    iconColor: "text-blue-400",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Globe,
    title: "Global API Integration",
    description: "Programmatic access to your keys through our secure REST API with global edge locations.",
    iconColor: "text-teal-400",
    gradient: "from-teal-500/20 to-cyan-500/20"
  }
]

const stats = [
  { number: "10K+", label: "Active Users", icon: Users },
  { number: "99.9%", label: "Uptime SLA", icon: Zap },
  { number: "256-bit", label: "AES Encryption", icon: Lock },
  { number: "24/7", label: "Support", icon: Shield }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Enterprise Features
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Everything you need for
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              secure key management
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Built for developers and teams who need enterprise-grade security 
            with an intuitive interface that scales with your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature) => (
            <div key={feature.title} className="group">
              <PremiumCard
                hover={true}
                className="p-8 h-full bg-slate-900/50 border-slate-700"
              >
                <div className="space-y-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    <span className="text-sm font-medium mr-2">Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </PremiumCard>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 group-hover:border-blue-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-300 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-12 border border-slate-700">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to secure your API keys?
            </h3>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and teams who trust us with their most sensitive credentials.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Free 14-day trial</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}