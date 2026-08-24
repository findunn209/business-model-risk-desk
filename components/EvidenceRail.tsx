import { Chip } from "@/components/Chip";
import { EVIDENCE_GLOSS, EVIDENCE_LABEL } from "@/lib/glance";
import type { FailureModeRow } from "@/lib/sample-report";

export function EvidenceRail({ rows }: { rows: FailureModeRow[] }) {
  return (
    <aside aria-labelledby="evidence-heading">
      <h2 id="evidence-heading" className="section-label">
        Evidence
      </h2>
      <ol className="mt-5 space-y-6">
        {rows.map((row) => {
          const thin =
            row.evidence === "inferred" || row.evidence === "unknown";
          return (
            <li key={row.id}>
              <p className="text-[0.95rem] leading-snug">
                <a href={`#${row.id}`}>{row.failure_mode}</a>
              </p>
              <p className="mt-2">
                <Chip>{EVIDENCE_LABEL[row.evidence]}</Chip>
              </p>
              {thin ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {EVIDENCE_GLOSS[row.evidence]}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
