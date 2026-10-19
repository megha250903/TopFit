import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-berry text-white shadow hover:bg-berry-dark",
        secondary:
          "border-transparent bg-petal text-plum hover:bg-petal-dark",
        outline:
          "border border-line text-plum bg-white/70",
        rose:
          "border-transparent bg-rose/20 text-berry font-medium",
        success:
          "border-transparent bg-success-light text-success-dark font-medium border border-success-border",
        missing:
          "border border-dashed border-rose text-muted bg-petal/40",
        tag:
          "border border-line bg-white/90 text-plum font-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
