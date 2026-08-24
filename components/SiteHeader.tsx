"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME } from "@/lib/site";

const nav = [
  { href: "/method", label: "Method" },
  { href: "/sample", label: "Anatomy" },
  { href: "/r/sample", label: "Sample" },
] as const;

function isCurrent(pathname: string, href: string) {
  if (href === "/r/sample") {
    return pathname === "/r/sample" || pathname.startsWith("/r/sample.");
  }
  return pathname === href;
}

export function SiteHeader() {
  const pathname = usePathname();
  const atHome = pathname === "/";

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-canvas items-baseline justify-between gap-6 px-6 py-3.5">
        <Link
          href="/"
          aria-current={atHome ? "page" : undefined}
          className={
            atHome
              ? "font-serif text-[13px] tracking-wide text-ink underline decoration-ink underline-offset-[0.35em]"
              : "font-serif text-[13px] tracking-wide text-ink no-underline"
          }
        >
          {SITE_NAME}
        </Link>
        <nav
          aria-label="Primary"
          className="flex flex-wrap gap-x-5 gap-y-1 text-[13px]"
        >
          {nav.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={
                  current
                    ? "text-ink underline decoration-ink underline-offset-[0.35em]"
                    : "text-muted no-underline hover:text-ink"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
