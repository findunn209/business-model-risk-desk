import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const nav = [
  { href: "/method", label: "Method" },
  { href: "/sample", label: "Anatomy" },
  { href: "/r/sample", label: "Sample report" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-6 px-6 py-5">
        <Link
          href="/"
          className="font-serif text-[1.05rem] tracking-tight text-ink no-underline"
        >
          {SITE_NAME}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted no-underline hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
