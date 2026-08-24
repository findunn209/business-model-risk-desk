import type { Metadata } from "next";
import {
  EVIDENCE,
  EVIDENCE_GLOSS,
  MODEL_CONDITION,
  MODEL_CONDITION_GLOSS,
  TIME_TO_BREAK,
  TIME_TO_BREAK_GLOSS,
} from "@/lib/glance";

export const metadata: Metadata = {
  title: "Method",
  description:
    "The glance object, and why Business Model Risk Desk refuses a company score.",
};

export default function MethodPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h1 className="font-serif text-4xl font-medium tracking-tight">Method</h1>
      <p className="mt-6 max-w-xl text-lg leading-snug">
        We publish how an internet/app model dies, and what would have to change
        for it to hold. We do not publish whether a company should exist.
      </p>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          We refuse a company score
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed">
          There is no 0–100. There is no letter grade. There is no Clear / Watch
          / Blocked wrap treated as credit. A single number on a company asks
          the wrong question and hides the mechanism. If evidence is thin, the
          glance says so. We do not average our way out of it.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          Glance
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed">
          A report opens with a glance object: four labeled fields. It is a
          structured read, not a rating.
        </p>
        <dl className="mt-8 divide-y divide-rule border-y border-rule">
          <div className="grid gap-1 py-4 sm:grid-cols-[12.5rem_1fr] sm:gap-6">
            <dt className="font-mono text-[0.8rem] text-muted">
              dominant_kill
            </dt>
            <dd className="leading-relaxed">
              The mechanism most likely to end this model as drawn. Plain
              language, not a code.
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[12.5rem_1fr] sm:gap-6">
            <dt className="font-mono text-[0.8rem] text-muted">
              time_to_break
            </dt>
            <dd>
              <ul className="space-y-2">
                {TIME_TO_BREAK.map((value) => (
                  <li key={value}>
                    <span className="font-mono text-[0.85rem]">{value}</span>
                    <span className="text-muted"> — {TIME_TO_BREAK_GLOSS[value]}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[12.5rem_1fr] sm:gap-6">
            <dt className="font-mono text-[0.8rem] text-muted">evidence</dt>
            <dd>
              <ul className="space-y-2">
                {EVIDENCE.map((value) => (
                  <li key={value}>
                    <span className="font-mono text-[0.85rem]">{value}</span>
                    <span className="text-muted"> — {EVIDENCE_GLOSS[value]}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[12.5rem_1fr] sm:gap-6">
            <dt className="font-mono text-[0.8rem] text-muted">
              model_condition
            </dt>
            <dd>
              <ul className="space-y-2">
                {MODEL_CONDITION.map((value) => (
                  <li key={value}>
                    <span className="font-mono text-[0.85rem]">{value}</span>
                    <span className="text-muted">
                      {" "}
                      — {MODEL_CONDITION_GLOSS[value]}
                    </span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          Kill table
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed">
          Rows are mechanisms. They are not rolled into a company total. A
          report may also state what would have to change for the model to hold.
          That is a plan for the model, not advice to invest, divest, or shut
          the company down.
        </p>
      </section>
    </main>
  );
}
