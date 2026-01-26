"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900",
          "disabled:opacity-50 disabled:cursor-not-allowed",

          // Variants
          {
            primary:
              "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 active:bg-green-700",
            secondary:
              "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500 active:bg-gray-400 dark:active:bg-gray-800",
            danger:
              "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:bg-red-700",
            ghost:
              "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500",
          }[variant],

          // Sizes
          {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-4 text-base",
            lg: "h-12 px-6 text-lg",
          }[size],

          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
