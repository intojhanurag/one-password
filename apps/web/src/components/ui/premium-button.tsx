"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight, Loader2 } from "lucide-react"
// import { motion } from "framer-motion"

interface PremiumButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  href?: string
  onClick?: () => void
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const variants = {
  primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0",
  secondary: "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-900 dark:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0",
  outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold transition-all duration-300 bg-transparent",
  ghost: "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 font-medium transition-all duration-300 bg-transparent"
}

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-12 px-8 text-lg",
  xl: "h-14 px-10 text-xl"
}

export function PremiumButton({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  onClick,
  loading = false,
  icon,
  iconPosition = "right"
}: PremiumButtonProps) {
  const buttonContent = (
    <div className="flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200">
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
      {!loading && !icon && iconPosition === "right" && <ArrowRight className="h-4 w-4" />}
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
      >
        {buttonContent}
      </a>
    )
  }

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {buttonContent}
    </Button>
  )
}
