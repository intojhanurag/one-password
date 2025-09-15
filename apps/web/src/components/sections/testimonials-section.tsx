"use client"

import { PremiumCard } from "@/components/ui/premium-card"
import { Star, Quote, Award, TrendingUp, Users } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, TechCorp",
    company: "Fortune 500",
    content: "This platform has revolutionized how we manage our API keys. The security is unmatched, and our team productivity has increased by 300%.",
    rating: 5,
    avatar: "SC",
    verified: true
  },
  {
    name: "Marcus Johnson",
    role: "Lead Developer",
    company: "StartupXYZ",
    content: "Finally, a solution that doesn't compromise on security for convenience. The audit trails give us complete visibility into key usage.",
    rating: 5,
    avatar: "MJ",
    verified: true
  },
  {
    name: "Elena Rodriguez",
    role: "Security Director",
    company: "GlobalBank",
    content: "Enterprise-grade security with an interface that our developers actually love to use. It's rare to find both in one solution.",
    rating: 5,
    avatar: "ER",
    verified: true
  }
]

const achievements = [
  { icon: Award, text: "Product of the Day", subtext: "2nd place" },
  { icon: TrendingUp, text: "300% productivity", subtext: "increase reported" },
  { icon: Users, text: "10,000+", subtext: "happy developers" }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-900/30 border border-yellow-800 text-yellow-300 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Wall of Love
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              What our customers
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              are saying
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Don&rsquo;t just take our word for it. See what industry leaders say about our platform.
          </p>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center group">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 group-hover:border-yellow-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <achievement.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {achievement.text}
                </div>
                <div className="text-yellow-400 font-medium">
                  {achievement.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="group">
              <PremiumCard
                hover={true}
                className="p-8 h-full relative bg-slate-800/50 border-slate-700"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-blue-400" />
                </div>

                {/* Verified Badge */}
                {testimonial.verified && (
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center space-x-1 bg-green-900/30 border border-green-800 rounded-full px-2 py-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-400 font-medium">Verified</span>
                    </div>
                  </div>
                )}

                <div className="space-y-6 pt-8">
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-slate-300 leading-relaxed text-lg group-hover:text-slate-200 transition-colors duration-300">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center space-x-4 pt-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-blue-400 font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join the community
            </h3>
            <p className="text-slate-300 mb-6">
              Over 10,000 developers trust One-Password with their most sensitive API keys
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-slate-900 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{i}</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-400">+ 9,994 more</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-slate-400 ml-2">4.9/5 average rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}