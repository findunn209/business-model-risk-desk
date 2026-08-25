import Link from "next/link";

const links = [
  { href: "/intake", label: "Evidence file", twin: false },
  { href: "/r/sample", label: "Sample", twin: false },
  { href: "/method", label: "Method", twin: false },
  { href: "/sample", label: "Anatomy", twin: false },
  { href: "/r/sample.md", label: ".md", twin: true },
  { href: "/llms.txt", label: "llms.txt", twin: false },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule">
      <div className="mx-auto max-w-canvas px-6 py-6">
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]"
        >
          {links.map((item, i) => (
            <span key={item.href} className="contents">
              {i > 0 ? (
                <span className="text-faint" aria-hidden="true">
                  ·
                </span>
              ) : null}
              <Link
                href={item.href}
                className={
                  item.twin
                    ? undefined
                    : "text-muted no-underline hover:text-ink"
                }
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
