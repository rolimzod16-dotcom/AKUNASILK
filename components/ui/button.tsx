import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-apple-black text-white hover:bg-apple-black/85",
        outline:
          "border-apple-border bg-background hover:bg-apple-gray text-apple-black",
        secondary: "bg-apple-gray text-apple-black hover:bg-[#e8e8ed]",
        ghost: "hover:bg-apple-gray text-apple-black",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-silk-turquoise underline-offset-4 hover:underline p-0 h-auto",
        apple:
          "bg-apple-blue text-white hover:bg-apple-blue-hover shadow-sm",
        silk:
          "bg-gradient-to-r from-silk-gold to-silk-amber text-silk-indigo font-bold shadow-lg shadow-silk-gold/40 hover:from-silk-gold-light hover:to-silk-gold hover:shadow-xl hover:shadow-silk-gold/50 focus-visible:ring-silk-gold/50",
        silkOutline:
          "border-silk-gold/50 bg-transparent text-silk-indigo hover:bg-silk-gold/10",
        appleOutline:
          "border-silk-turquoise/40 bg-transparent text-silk-turquoise hover:bg-silk-turquoise/5",
      },
      size: {
        default: "h-9 gap-1.5 px-4",
        sm: "h-8 gap-1 px-3 text-[0.8rem]",
        lg: "h-10 gap-2 px-5",
        icon: "size-9",
        "icon-sm": "size-8",
        pill: "h-11 gap-2 rounded-full px-7 text-sm font-medium",
        "pill-sm": "h-9 gap-1.5 rounded-full px-5 text-xs font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }