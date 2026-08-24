import { Chip } from "@/components/Chip";
import { EVIDENCE_GLOSS, EVIDENCE_LABEL, type Evidence } from "@/lib/glance";
import type { FailureModeRow } from "@/lib/sample-report";

export function EvidenceRail({ rows }: { rows: FailureModeRow[] }) {
  const present = [...new Set(rows.map((row) => row.evidence))];
  const stated = present.filter(
    (value): value is Evidence =>
      value === "inferred" || value === "unknown",
  );

  return (
    <aside aria-labelledby="evidence-heading">
      <h2 id="evidence-heading" className="section-label">
        Evidence
      </h2>
      {stated.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {stated.map((value) => (
            <li key={value}>
              <Chip>{EVIDENCE_LABEL[value]}</Chip>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {EVIDENCE_GLOSS[value]}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      <ol className="mt-6 space-y-5 border-t border-rule pt-5">
        {rows.map((row) => (
          <li key={row.id}>
            <p className="text-[0.95rem] leading-snug">
              <a href={`#${row.id}`}>{row.failure_mode}</a>
            </p>
            <p className="mt-1.5">
              <Chip>{EVIDENCE_LABEL[row.evidence]}</Chip>
            </p>
          </li>
        ))}
      </ol>
    </aside>
  );
}
