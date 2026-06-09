import * as React from 'react'
import { cn } from './utils'

export const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn('rounded-lg border border-border bg-card px-4 py-3 text-sm', className)}
      {...props}
    />
  ),
)
Alert.displayName = 'Alert'

export const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('font-semibold', className)} {...props} />
  ),
)
AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-1 text-sm text-muted-foreground', className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'
