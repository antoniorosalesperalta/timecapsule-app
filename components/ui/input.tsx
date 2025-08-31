import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, ...props }, ref) => {
    return (
      <input
        type={type}
        placeholder={placeholder || (type === "email" ? "Correo electrónico" : type === "password" ? "Contraseña" : "")}
        className={cn(
          "flex h-11 w-full rounded-md border border-pink-200 bg-white px-3 py-2 text-base text-gray-800 shadow-sm placeholder:text-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
