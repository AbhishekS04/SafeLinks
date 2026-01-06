
import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",

                    // Size variants
                    size === "sm" && "h-8 px-3 text-xs",
                    size === "md" && "h-10 px-4 text-sm",
                    size === "lg" && "h-12 px-6 text-base",

                    // Style variants
                    variant === "primary" &&
                    "bg-foreground text-background hover:bg-neutral-800 shadow-sm hover:shadow-md",

                    variant === "secondary" &&
                    "bg-white border border-border text-foreground hover:bg-gray-50 hover:border-gray-300 shadow-sm",

                    variant === "ghost" &&
                    "bg-transparent text-muted-foreground hover:text-foreground hover:bg-black/5",

                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
