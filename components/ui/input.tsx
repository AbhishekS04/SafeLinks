
import * as React from "react"
import { cn } from "./button" // Re-using cn utility

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-transparent bg-input/50 px-3 py-2 text-sm placeholder:text-muted-foreground/60 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-transparent",
                    "hover:bg-input/80", // Subtle interaction
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "shadow-sm",
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
