import type { FailureModeRow } from "@/lib/sample-report";

export function FailureModes({ rows }: { rows: FailureModeRow[] }) {
  return (
    <section aria-labelledby="failure-modes-heading">
      <h2
        id="failure-modes-heading"
        className="font-serif text-2xl font-medium tracking-tight"
      >
        Failure modes
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Where this internet/app model breaks. Each row is a failure mode, not a
        sub-score.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/20">
              <th className="py-2 pr-4 font-sans font-medium">Break</th>
              <th className="py-2 pr-4 font-sans font-medium">
                How the model breaks
              </th>
              <th className="py-2 pr-4 font-sans font-medium">
                time_to_break
              </th>
              <th className="py-2 font-sans font-medium">evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.failure_mode}
                className="border-b border-rule align-top"
              >
                <td className="py-3 pr-4 font-medium">{row.failure_mode}</td>
                <td className="py-3 pr-4 leading-relaxed text-ink">
                  {row.how_the_model_breaks}
                </td>
                <td className="py-3 pr-4 font-mono text-[0.8rem] text-muted">
                  {row.time_to_break}
                </td>
                <td className="py-3 font-mono text-[0.8rem] text-muted">
                  {row.evidence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
