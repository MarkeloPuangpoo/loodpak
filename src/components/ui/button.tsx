import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-black uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:translate-y-[4px] border-[3px]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-indigo-500 to-purple-600 text-white border-indigo-950 shadow-[0px_6px_0px_0px_#1e1b4b] hover:from-indigo-400 hover:to-purple-500 hover:shadow-[0px_2px_0px_0px_#1e1b4b] hover:translate-y-[4px] active:shadow-none",
        destructive:
          "bg-gradient-to-b from-rose-500 to-red-600 text-white border-rose-950 shadow-[0px_6px_0px_0px_#4c0519] hover:from-rose-400 hover:to-red-500 hover:shadow-[0px_2px_0px_0px_#4c0519] hover:translate-y-[4px] active:shadow-none",
        outline:
          "bg-white text-slate-700 border-slate-300 shadow-[0px_6px_0px_0px_#cbd5e1] hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 hover:shadow-[0px_2px_0px_0px_#94a3b8] hover:translate-y-[4px] active:shadow-none",
        secondary:
          "bg-gradient-to-b from-amber-400 to-orange-500 text-amber-950 border-amber-950 shadow-[0px_6px_0px_0px_#78350f] hover:from-amber-300 hover:to-orange-400 hover:shadow-[0px_2px_0px_0px_#78350f] hover:translate-y-[4px] active:shadow-none",
        ghost: 
          "border-transparent shadow-none hover:bg-slate-100 hover:text-slate-900 active:translate-y-0",
        link: 
          "border-transparent shadow-none text-indigo-600 underline-offset-4 hover:underline active:translate-y-0",
      },
      size: {
        default: "h-12 px-6 py-2 text-base",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-2xl px-8 text-lg",
        xl: "h-16 rounded-[1.25rem] px-10 text-xl",
        icon: "h-12 w-12",
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