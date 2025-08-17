import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "destructive" | "outline";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium";
  const styles: Record<Variant, string> = {
    default: "border-transparent bg-neutral-900 dark:bg-gray-700 text-white",
    secondary:
      "border-transparent bg-neutral-100 dark:bg-gray-600 text-neutral-900 dark:text-white",
    destructive: "border-transparent bg-red-600 text-white",
    outline:
      "text-neutral-700 dark:text-gray-300 border-neutral-300 dark:border-gray-600",
  };
  return <span className={cn(base, styles[variant], className)} {...props} />;
}
