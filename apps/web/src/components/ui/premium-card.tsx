"use client"

import { cn } from "@/lib/utils"
// import { motion } from "framer-motion"

interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  gradient?: boolean
}

export function PremiumCard({
  children,
  className,
  hover = true,
  glass = false,
  gradient = false
}: PremiumCardProps) {
  const baseClasses = "rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm"
  
  const variantClasses = cn(
    glass && "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50",
    gradient && "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50",
    !glass && !gradient && "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
  )

  const hoverClasses = hover ? "hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl hover:shadow-blue-500/10" : ""

  if (hover) {
    return (
      <div
        className={cn(
          baseClasses,
          variantClasses,
          hoverClasses,
          "transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1",
          className
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses,
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  )
}
