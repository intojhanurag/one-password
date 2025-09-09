"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { FooterSection } from "@/components/sections/footer-section"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    
    if (token && user) {
      // User is authenticated, redirect to dashboard
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-slate-900">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  )
}
