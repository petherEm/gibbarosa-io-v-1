import { cn } from "@/lib/utils";
import type React from "react";

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  children: React.ReactNode;
}

export const Heading = ({
  as: Component = "h2",
  className,
  children,
}: HeadingProps) => {
  return (
    <Component
      className={cn(
        "text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-foreground text-balance leading-[1.1]",
        className
      )}
    >
      {children}
    </Component>
  );
};
