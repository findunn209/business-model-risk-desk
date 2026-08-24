import { Chip } from "@/components/Chip";
import { Term } from "@/components/Term";
import { FAILURE_MODE_DEFINITION, TIME_TO_BREAK_LABEL } from "@/lib/glance";
import type { FailureModeRow } from "@/lib/sample-report";

export function FailureModes({ rows }: { rows: FailureModeRow[] }) {
  return (
    <section aria-labelledby="failure-modes-heading">
      <h2 id="failure-modes-heading" className="section-label">
        Failure modes
      </h2>
      <p className="mt-2 max-w-measure text-sm leading-relaxed text-muted">
        {FAILURE_MODE_DEFINITION}
      </p>
      <ol className="mt-5 divide-y divide-rule border-y border-rule">
        {rows.map((row) => (
          <li
            key={row.id}
            id={row.id}
            className="scroll-mt-8 py-5 first:pt-4 last:pb-4"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <Chip>{TIME_TO_BREAK_LABEL[row.time_to_break]}</Chip>
              <h3 className="font-sans text-[1.05rem] font-medium leading-snug">
                {row.failure_mode}
              </h3>
            </div>
            {row.jargon?.map((item) => (
              <p
                key={item.term}
                className="mt-2 max-w-measure text-sm leading-relaxed text-muted"
              >
                <Term definition={item.definition}>{item.term}</Term>
                {" — "}
                {item.definition}
              </p>
            ))}
            <p className="mt-2 max-w-measure leading-relaxed">
              {row.how_the_model_breaks}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
