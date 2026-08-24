import type { HoldPlanItem, PlanBind } from "@/lib/sample-report";

export function HoldPlan({
  items,
  binds,
}: {
  items: HoldPlanItem[];
  binds: PlanBind[];
}) {
  const byId = new Map(binds.map((row) => [row.id, row]));

  return (
    <section aria-labelledby="hold-plan-heading" className="mt-14">
      <h2 id="hold-plan-heading" className="section-label">
        If this model is to hold
      </h2>
      <ol className="mt-5 max-w-measure list-decimal space-y-5 pl-5">
        {items.map((item, index) => {
          const bind = byId.get(item.failure_mode_id);
          const prevId = index > 0 ? items[index - 1].failure_mode_id : null;
          const showLabel = bind && bind.id !== prevId;
          return (
            <li key={index} className="leading-relaxed">
              {bind && showLabel ? (
                <p className="mb-1 font-mono text-[11px] tracking-wide">
                  <a href={`#${bind.id}`}>{bind.label}</a>
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
