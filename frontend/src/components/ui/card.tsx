import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-[#1f1f1f] bg-[#141414] text-gray-200 shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }