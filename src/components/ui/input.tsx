import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-2xl border-[3px] border-slate-200 bg-slate-50 px-5 py-3 text-lg font-bold text-slate-800 shadow-inner transition-all file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-slate-800 placeholder:text-slate-400 placeholder:font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }