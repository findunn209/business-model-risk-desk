import type { KillRow } from "@/lib/sample-report";

export function KillTable({ rows }: { rows: KillRow[] }) {
  return (
    <section aria-labelledby="kill-heading">
      <h2
        id="kill-heading"
        className="font-serif text-2xl font-medium tracking-tight"
      >
        Kill table
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        How this internet/app model dies. Each row is a mechanism, not a
        sub-score.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/20">
              <th className="py-2 pr-4 font-sans font-medium">Kill</th>
              <th className="py-2 pr-4 font-sans font-medium">
                How it ends the model
              </th>
              <th className="py-2 pr-4 font-sans font-medium">
                time_to_break
              </th>
              <th className="py-2 font-sans font-medium">evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.kill} className="border-b border-rule align-top">
                <td className="py-3 pr-4 font-medium">{row.kill}</td>
                <td className="py-3 pr-4 leading-relaxed text-ink">
                  {row.how_it_ends_the_model}
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
