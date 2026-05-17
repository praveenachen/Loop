import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 text-sm font-extrabold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-ink/80 bg-ink text-white shadow-card hover:-translate-y-0.5 hover:shadow-lift",
        secondary: "border-stroke bg-white text-ink hover:bg-surface-soft",
        ghost: "border-transparent text-ink-soft hover:bg-surface-soft hover:text-ink",
        marketplace: "border-marketplace/60 bg-marketplace text-white hover:brightness-95",
        rides: "border-rides/70 bg-rides text-ink hover:brightness-95",
        study: "border-study/60 bg-study text-white hover:brightness-95"
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
