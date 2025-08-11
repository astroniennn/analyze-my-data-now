import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statCardVariants = cva(
  "relative overflow-hidden rounded-lg bg-card text-card-foreground shadow-card border border-card-border transition-all duration-300 hover:shadow-hover",
  {
    variants: {
      variant: {
        default: "hover:scale-[1.02]",
        primary: "bg-gradient-primary text-primary-foreground",
        success: "bg-gradient-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        danger: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string
  value: string | number
  change?: {
    value: string | number
    type: "increase" | "decrease" | "neutral"
  }
  icon?: React.ReactNode
  subtitle?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, variant, size, title, value, change, icon, subtitle, ...props }, ref) => {
    const getChangeColor = () => {
      if (!change) return ""
      switch (change.type) {
        case "increase":
          return "text-success"
        case "decrease":
          return "text-destructive"
        default:
          return "text-muted-foreground"
      }
    }

    return (
      <div
        className={cn(statCardVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div className="relative">
          {/* Header with title and icon */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                {icon}
              </div>
            )}
          </div>

          {/* Main value */}
          <div className="space-y-1">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            
            {/* Subtitle */}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            
            {/* Change indicator */}
            {change && (
              <div className={cn("flex items-center text-xs font-medium", getChangeColor())}>
                <span className="mr-1">
                  {change.type === "increase" ? "↗" : change.type === "decrease" ? "↘" : "→"}
                </span>
                {change.value}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard, statCardVariants }