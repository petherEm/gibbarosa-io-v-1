import { Logo } from "./logo";
import { Container } from "./container";
import Link from "next/link";
import {
  IconBrandInstagram,
  IconBrandPinterest,
  IconBrandTiktok,
} from "@tabler/icons-react";

export const Footer = () => {
  const shop = [
    { title: "All Products", href: "/shop" },
    { title: "New Arrivals", href: "/shop?sort=newest" },
    { title: "Promotions", href: "/shop?sale=true" },
  ];

  const company = [
    { title: "About Us", href: "/about" },
    { title: "Sell With Us", href: "/sell" },
    { title: "Authentication", href: "/authentication" },
    { title: "Sustainability", href: "/sustainability" },
  ];

  const support = [
    { title: "Contact", href: "/contact" },
    { title: "FAQs", href: "/faq" },
    { title: "Shipping", href: "/shipping" },
    { title: "Returns", href: "/returns" },
  ];

  return (
    <footer className="border-t border-border py-16 md:py-24 bg-background">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Logo />
            <p className="mt-6 text-sm font-[Inter,sans-serif] text-muted-foreground leading-relaxed max-w-xs">
              Curated preowned luxury for the discerning collector. Every piece
              authenticated, every story preserved.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <IconBrandInstagram className="size-5" />
              </Link>
              <Link
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Pinterest"
              >
                <IconBrandPinterest className="size-5" />
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="TikTok"
              >
                <IconBrandTiktok className="size-5" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-foreground mb-6">
              Shop
            </h4>
            <ul className="space-y-4">
              {shop.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-sm font-[Inter,sans-serif] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-foreground mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {company.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-sm font-[Inter,sans-serif] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase text-foreground mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              {support.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-sm font-[Inter,sans-serif] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-[Inter,sans-serif] text-muted-foreground">
            © {new Date().getFullYear()} Gibbarosa. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs font-[Inter,sans-serif] text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-[Inter,sans-serif] text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
