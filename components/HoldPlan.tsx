import type { FailureModeRow, HoldPlanItem } from "@/lib/sample-report";

export function HoldPlan({
  items,
  modes,
}: {
  items: HoldPlanItem[];
  modes: FailureModeRow[];
}) {
  const byId = new Map(modes.map((row) => [row.id, row]));

  return (
    <section aria-labelledby="hold-plan-heading" className="mt-14">
      <h2 id="hold-plan-heading" className="section-label">
        If this model is to hold
      </h2>
      <ol className="mt-5 max-w-measure list-decimal space-y-5 pl-5">
        {items.map((item, index) => {
          const mode = byId.get(item.failure_mode_id);
          return (
            <li key={index} className="leading-relaxed">
              {mode ? (
                <p className="mb-1 font-mono text-[11px] tracking-wide">
                  <a href={`#${mode.id}`}>{mode.failure_mode}</a>
                </p>
              ) : null}
              <p>{item.text}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
