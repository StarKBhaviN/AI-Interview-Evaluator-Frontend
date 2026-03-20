import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  variant?: "default" | "success" | "warning" | "danger" | "gradient"
  size?: "sm" | "md" | "lg"
  showStripes?: boolean
}

const variantColors: Record<string, string> = {
  default: "bg-[var(--primary)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger: "bg-[var(--danger)]",
  gradient: "bg-gradient-to-r from-[var(--primary)] via-purple-500 to-[var(--accent)]",
}

const sizeClasses: Record<string, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, variant = "default", size = "md", showStripes = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-full overflow-hidden",
          "bg-white/5",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantColors[variant],
            showStripes && "bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] animate-[progress-stripe_1s_linear_infinite]"
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
export type { ProgressProps }
