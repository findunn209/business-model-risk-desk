import { DISCLAIMER, PROMISE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule">
      <div className="mx-auto max-w-3xl px-6 py-10 text-sm text-muted">
        <p className="max-w-xl font-serif text-[1.05rem] leading-snug text-ink">
          {PROMISE}
        </p>
        <p className="mt-4 max-w-xl">{DISCLAIMER}</p>
      </div>
    </footer>
  );
}
