import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"

const NoOverlayDialog = DialogPrimitive.Root

const NoOverlayDialogTrigger = DialogPrimitive.Trigger

const NoOverlayDialogPortal = DialogPrimitive.Portal

const NoOverlayDialogClose = DialogPrimitive.Close

// This version doesn't render the dark overlay
const NoOverlayDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    {/* No overlay component here */}
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
NoOverlayDialogContent.displayName = DialogPrimitive.Content.displayName

const NoOverlayDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
NoOverlayDialogHeader.displayName = "NoOverlayDialogHeader"

const NoOverlayDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
NoOverlayDialogFooter.displayName = "NoOverlayDialogFooter"

const NoOverlayDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
NoOverlayDialogTitle.displayName = DialogPrimitive.Title.displayName

const NoOverlayDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
NoOverlayDialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  NoOverlayDialog,
  NoOverlayDialogPortal,
  NoOverlayDialogClose,
  NoOverlayDialogTrigger,
  NoOverlayDialogContent,
  NoOverlayDialogHeader,
  NoOverlayDialogFooter,
  NoOverlayDialogTitle,
  NoOverlayDialogDescription,
}