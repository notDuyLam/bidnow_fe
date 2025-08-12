"use client";

import * as React from "react";

type Variant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: React.ReactNode;
}

const variantClassName: Record<Variant, string> = {
  default: "bg-black text-white hover:bg-neutral-800",
  secondary: "bg-neutral-200 text-black hover:bg-neutral-300",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-neutral-300 hover:bg-neutral-100",
  ghost: "hover:bg-neutral-100",
  link: "underline underline-offset-4",
};

export function Button({ variant = "default", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variantClassName[variant]} ${className}`}
      {...props}
    />
  );
}


