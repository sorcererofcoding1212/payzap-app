import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm md:text-base font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100 disabled:text-neutral-3000 py-2",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-blue-500 to-blue-600 text-base-content lg:hover:from-blue-700 lg:hover:to-blue-700",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-600 text-white lg:hover:from-red-600 lg:hover:to-red-600",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-base-100 text-base-content hover:bg-base-300 shadow-xs lg:shadow-sm",
        ghost:
          "border-transparent shadow-none hover:bg-accent hover:text-accent-foreground",
        muted: "bg-neutral-200 text-nuetral-600 hover:bg-neutral-200/80",
        teritary: "text-base-content shadow btn-accent btn text-white",
        card: "text-base-100 shadow bg-base-content",
      },
      size: {
        default:
          "h-10 md:min-w-22 min-w-18 text-sm md:text-base md:h-11 px-4 py-2",
        variable:
          "h-8 md:min-w-22 rounded-sm lg:rounded-md min-w-18 text-[13.1px] md:text-base md:h-10 px-4 py-1 lg:py-2",
        sm: "h-8 rounded-md px-3",
        xs: "h-7 rounded-md px-2 text-xs",
        lg: "h-12 rounded-md px-6",
        icon: "size-8",
        card: "h-11 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        "cursor-pointer"
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
