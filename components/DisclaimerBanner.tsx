import { DISCLAIMER } from "@/lib/site";

export function DisclaimerBanner() {
  return (
    <p
      role="note"
      className="border border-rule bg-paper px-4 py-3 text-sm leading-relaxed text-ink"
    >
      {DISCLAIMER}
    </p>
  );
}
