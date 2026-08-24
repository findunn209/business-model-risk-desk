import type { Glance } from "@/lib/glance";

const fields: { key: keyof Glance; label: string }[] = [
  { key: "dominant_break", label: "dominant_break" },
  { key: "time_to_break", label: "time_to_break" },
  { key: "evidence", label: "evidence" },
  { key: "model_condition", label: "model_condition" },
];

export function GlanceObject({ glance }: { glance: Glance }) {
  return (
    <section aria-labelledby="glance-heading">
      <h2
        id="glance-heading"
        className="font-serif text-2xl font-medium tracking-tight"
      >
        Glance
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Not a 0–100 score. Not a letter grade. Not Clear / Watch / Blocked as
        credit. Four fields; no company total.
      </p>
      <dl className="mt-6 divide-y divide-rule border-y border-rule">
        {fields.map((field) => (
          <div
            key={field.key}
            className="grid gap-1 py-4 sm:grid-cols-[12.5rem_1fr] sm:gap-6"
          >
            <dt className="font-mono text-[0.8rem] text-muted">{field.label}</dt>
            <dd className="text-[1.05rem] leading-snug">{glance[field.key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
