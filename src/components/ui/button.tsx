import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-ring disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-berry to-berry-dark text-white shadow-pink-sm hover:shadow-pink-md hover:-translate-y-0.5 active:translate-y-0 disabled:bg-petal disabled:from-petal disabled:to-petal disabled:text-muted disabled:shadow-none",
        outline:
          "border border-line bg-white/80 text-plum hover:bg-petal/60 hover:border-rose active:bg-petal",
        secondary:
          "bg-petal text-plum hover:bg-petal-dark active:bg-rose/30",
        ghost:
          "text-plum hover:bg-petal/50 active:bg-petal",
        subtle:
          "bg-white text-muted hover:text-plum border border-line/60 hover:border-rose/50",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        success:
          "bg-success text-white hover:bg-success-dark shadow-sm",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-7 text-base font-semibold",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
