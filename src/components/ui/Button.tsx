"use client";

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[11px] gap-1.5 rounded-lg",
  md: "px-4 py-2 text-xs gap-1.5 rounded-xl",
  lg: "px-5 py-2.5 text-sm gap-2 rounded-xl",
};

const variantClasses: Record<ButtonVariant, string> = {
  // Primary: gold gradient fill — the single highest-emphasis CTA style in the app.
  primary:
    "text-[#1a1206] font-bold shadow-lg shadow-[var(--gold-glow)] hover:brightness-110 hover:shadow-xl active:brightness-95 border border-transparent disabled:opacity-50 disabled:pointer-events-none",
  // Secondary: 1px border, transparent/surface background, text-colored.
  secondary:
    "bg-surface-2/60 border border-line hover:border-line-strong hover:bg-surface-2 text-text font-semibold disabled:opacity-50 disabled:pointer-events-none",
  // Ghost: text-only, no border, subtle hover wash.
  ghost:
    "bg-transparent border border-transparent hover:bg-surface-2 text-text-muted hover:text-text font-medium disabled:opacity-50 disabled:pointer-events-none",
  // Danger: reserved for destructive actions (delete, reset).
  danger:
    "bg-transparent border border-transparent hover:bg-rust/10 text-text-muted hover:text-rust font-semibold disabled:opacity-50 disabled:pointer-events-none",
};

const primaryGradientStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark))",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      icon,
      iconPosition = "left",
      fullWidth = false,
      className = "",
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-sans transition-all btn-tactile cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        style={variant === "primary" ? { ...primaryGradientStyle, ...style } : style}
        {...props}
      >
        {icon && iconPosition === "left" && icon}
        {children}
        {icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";
