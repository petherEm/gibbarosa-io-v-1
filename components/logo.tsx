import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/gibbarosa-logo.svg"
        alt="Gibbarosa"
        width={140}
        height={27}
        className="dark:invert"
        priority
      />
    </Link>
  );
};

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/gibbarosa-logo.svg"
      alt="Gibbarosa"
      width={140}
      height={27}
      className={className ?? "dark:invert"}
    />
  );
};
