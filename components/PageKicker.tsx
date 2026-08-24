import { PAGE_KICKER } from "@/lib/site";

export function PageKicker({ className }: { className?: string }) {
  return (
    <p role="note" className={className ? `kicker ${className}` : "kicker"}>
      {PAGE_KICKER}
    </p>
  );
}
