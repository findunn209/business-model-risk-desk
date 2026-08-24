import type { Metadata } from "next";
import Link from "next/link";
import { sampleReport } from "@/lib/sample-report";

export const metadata: Metadata = {
  title: "Sample anatomy",
  description:
    "How to read the frozen sample report. Labeled fiction; not a real company.",
};

export default function SampleAnatomyPage() {
  const { company, glance, failure_modes } = sampleReport;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h1 className="font-serif text-4xl font-medium tracking-tight">
        Anatomy of the sample
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-snug">
        A walk through the frozen report on{" "}
        <Link href="/r/sample">{company.name}</Link> — labeled fiction, not a
        real company. Same data as{" "}
        <Link href="/r/sample.md">/r/sample.md</Link>.
      </p>

      <ol className="mt-14 space-y-10">
        <li>
          <h2 className="font-serif text-2xl font-medium tracking-tight">
            1. Banner
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed">
            Every report states what it is not: not a credit rating, not
            investment advice, not a verdict on whether the company should
            exist. The sample is also marked as fiction so it cannot be misread
            as coverage of a live firm.
          </p>
        </li>
        <li>
          <h2 className="font-serif text-2xl font-medium tracking-tight">
            2. Claimed model
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed">
            We describe the internet/app model as drawn — here, a local-services
            marketplace with an in-app take-rate — before we say where that model
            breaks. The object of the report is the model, not the worth of the
            people running it.
          </p>
        </li>
        <li>
          <h2 className="font-serif text-2xl font-medium tracking-tight">
            3. Glance
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed">
            Four fields. For this sample:{" "}
            <span className="font-mono text-[0.9rem]">
              dominant_break
            </span>{" "}
            is {glance.dominant_break};{" "}
            <span className="font-mono text-[0.9rem]">time_to_break</span> is{" "}
            {glance.time_to_break};{" "}
            <span className="font-mono text-[0.9rem]">evidence</span> is{" "}
            {glance.evidence};{" "}
            <span className="font-mono text-[0.9rem]">model_condition</span> is{" "}
            {glance.model_condition}. There is still no company score.
          </p>
        </li>
        <li>
          <h2 className="font-serif text-2xl font-medium tracking-tight">
            4. Failure modes
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed">
            {failure_modes.length} rows. The first two sit on this_cycle because
            bypass and unit economics are the same leak. Later rows (supply
            unwind, liability, demand capture) can break the model if the leak
            is not closed. None of them is averaged into a grade.
          </p>
        </li>
        <li>
          <h2 className="font-serif text-2xl font-medium tracking-tight">
            5. If this model is to hold
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed">
            The plan is what would have to change in the model — introduction
            fee plus tools, contractor of record, or a SKU that cannot be
            bypassed. It is not a recommendation to keep or close the company.
          </p>
        </li>
      </ol>
    </main>
  );
}
