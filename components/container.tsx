import { cn } from "@/lib/utils";
import type React from "react";

export const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("max-w-7xl px-6 md:px-8 lg:px-12 mx-auto", className)}>
      {children}
    </div>
  );
};
