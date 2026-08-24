import type { Metadata } from "next";
import Link from "next/link";
import { GlanceObject } from "@/components/GlanceObject";
import { FailureModes } from "@/components/FailureModes";
import { sampleReport } from "@/lib/sample-report";

export const metadata: Metadata = {
  title: "Sample anatomy",
  description:
    "How to read the frozen sample report. Labeled fiction; not a real company.",
};

export default function SampleAnatomyPage() {
  const { company, glance, failure_modes } = sampleReport;

  return (
    <main className="mx-auto w-full max-w-canvas flex-1 px-6 py-12">
      <h1 className="font-serif text-4xl font-medium tracking-tight">
        Anatomy of the sample
      </h1>
      <p className="mt-5 max-w-measure text-[1.05rem] leading-snug">
        A walk through the frozen report on{" "}
        <Link href="/r/sample">{company.name}</Link> — labeled fiction, not a
        real company. Same data as{" "}
        <Link href="/r/sample.md">/r/sample.md</Link>.
      </p>

      <div className="mt-12">
        <h2 className="section-label">Glance</h2>
        <p className="mt-3 max-w-measure leading-relaxed">
          Four fields. There is still no company score.
        </p>
        <div className="mt-6">
          <GlanceObject glance={glance} />
        </div>
      </div>

      <div className="mt-14">
        <FailureModes rows={failure_modes} />
        <p className="mt-4 max-w-measure leading-relaxed">
          The first two sit on this cycle because bypass and unit economics are
          the same leak. Later rows (supply unwind, liability, demand capture)
          can break the model if the leak is not closed. None of them is
          averaged into a grade.
        </p>
      </div>

      <section className="mt-14 max-w-measure">
        <h2 className="section-label">If this model is to hold</h2>
        <p className="mt-3 leading-relaxed">
          The plan is what would have to change in the model — introduction fee
          plus tools, contractor of record, or a SKU that cannot be bypassed. It
          is not a recommendation to keep or close the company.
        </p>
      </section>

      <p className="mt-12">
        <Link href="/r/sample">Read the Porchlist sample</Link>
      </p>
    </main>
  );
}
