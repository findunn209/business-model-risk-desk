import type { Metadata } from "next";
import Link from "next/link";
import { GlanceObject } from "@/components/GlanceObject";
import {
  EVIDENCE,
  EVIDENCE_GLOSS,
  EVIDENCE_LABEL,
  MODEL_CONDITION,
  MODEL_CONDITION_GLOSS,
  MODEL_CONDITION_LABEL,
  TIME_TO_BREAK,
  TIME_TO_BREAK_GLOSS,
  TIME_TO_BREAK_LABEL,
} from "@/lib/glance";
import { sampleReport } from "@/lib/sample-report";

export const metadata: Metadata = {
  title: "Method",
  description:
    "The glance object, and why Business Model Risk Desk refuses a company score.",
};

export default function MethodPage() {
  return (
    <main className="mx-auto w-full max-w-measure flex-1 px-6 py-12">
      <h1 className="font-serif text-4xl font-medium tracking-tight">Method</h1>
      <p className="mt-6 text-[1.05rem] leading-snug">
        We publish where an internet/app model breaks, and the plan to fix those
        breaks. We do not publish whether a company should exist.
      </p>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          We refuse a company score
        </h2>
        <p className="mt-3 leading-relaxed">
          There is no 0–100. There is no letter grade. There is no Clear / Watch
          / Blocked wrap treated as credit. A single number on a company asks
          the wrong question and hides the failure mode. If evidence is thin, the
          glance says so. We do not average our way out of it.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          Glance
        </h2>
        <p className="mt-3 leading-relaxed">
          A report opens with a glance object: four labeled fields. It is a
          structured read, not a rating.
        </p>
        <dl className="mt-8 divide-y divide-rule border-y border-rule">
          <div className="grid gap-1 py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
            <dt className="font-mono text-[11px] tracking-wide text-muted">
              dominant_break
            </dt>
            <dd className="leading-relaxed">
              The failure mode most likely to break this model as drawn — where
              the money path stops working. Plain language, not a code.
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
            <dt className="font-mono text-[11px] tracking-wide text-muted">
              time_to_break
            </dt>
            <dd>
              <ul className="space-y-2">
                {TIME_TO_BREAK.map((value) => (
                  <li key={value}>
                    <span className="chip">{TIME_TO_BREAK_LABEL[value]}</span>
                    <span className="text-muted"> — {TIME_TO_BREAK_GLOSS[value]}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
            <dt className="font-mono text-[11px] tracking-wide text-muted">
              evidence
            </dt>
            <dd>
              <ul className="space-y-2">
                {EVIDENCE.map((value) => (
                  <li key={value}>
                    <span className="chip">{EVIDENCE_LABEL[value]}</span>
                    <span className="text-muted"> — {EVIDENCE_GLOSS[value]}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
            <dt className="font-mono text-[11px] tracking-wide text-muted">
              model_condition
            </dt>
            <dd>
              <ul className="space-y-2">
                {MODEL_CONDITION.map((value) => (
                  <li key={value}>
                    <span className="chip">{MODEL_CONDITION_LABEL[value]}</span>
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
          Worked glance
        </h2>
        <p className="mt-3 leading-relaxed">
          {sampleReport.company.name} — labeled fiction, not a real company.
        </p>
        <div className="mt-6">
          <GlanceObject glance={sampleReport.glance} />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          Failure modes
        </h2>
        <p className="mt-3 leading-relaxed">
          Rows are breaks. They are not rolled into a company total. A report
          may also state what would have to change for the model to hold. That
          is a plan to fix those breaks, not advice to invest, divest, or shut
          the company down.
        </p>
      </section>

      <p className="mt-12">
        <Link href="/r/sample">Read the Porchlist sample</Link>
      </p>
    </main>
  );
}
