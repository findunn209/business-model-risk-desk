import type { Metadata } from "next";
import Link from "next/link";
import { FailureModes } from "@/components/FailureModes";
import { GlanceObject } from "@/components/GlanceObject";
import { PageKicker } from "@/components/PageKicker";
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
      <PageKicker className="mt-3" />
      <p className="mt-5 max-w-measure text-[1.05rem] leading-snug">
        A walk through the frozen report on{" "}
        <Link href="/r/sample">{company.name}</Link> — labeled fiction, not a
        real company. Same data as{" "}
        <Link href="/r/sample.md">/r/sample.md</Link>.
      </p>

      <div className="mt-12">
        <h2 className="section-label">Glance</h2>
        <p className="mt-3 max-w-measure leading-relaxed">
          Four fields. For a first-time operator the money path breaks because
          you took the homeowner’s payment without the three checks, not at
          later off-platform leakage. Evidence is inferred. This fiction
          assumes those checks are missing; if the operator had them, this
          would not be the dominant break.
        </p>
        <div className="mt-6">
          <GlanceObject glance={glance} />
        </div>
      </div>

      <div className="mt-14">
        <FailureModes rows={failure_modes} />
        <p className="mt-4 max-w-measure leading-relaxed">
          The first three sit on this cycle: you took the money without the
          three checks, charging the homeowner is being the merchant of record
          because you take 100% of the payment, and a “verified” badge is not
          a first-job check. Off-platform repeat business is later — you have
          to finish a first job before anyone can go around you. Two short
          sections on the report name processor underwrite tripwires and legal
          and contractable issues a first-time operator misses.
        </p>
      </div>

      <section className="mt-14 max-w-measure">
        <h2 className="section-label">If this model is to hold</h2>
        <p className="mt-3 leading-relaxed">
          The plan is numbered to those same breaks plus the tripwire sections:
          the three checks before payout, cash that can cover the days between
          charge and job done as volume grows, a marketplace-MoR underwrite
          you can pass, treat charging the homeowner as being merchant of
          record (the take rate is the fee; 100% of GMV is the exposure — or
          charge the worker’s account / sell the introduction only), license
          and deposit rules before you scale, and keep the next job on the
          platform or stop sitting in the charge.
        </p>
      </section>

      <p className="mt-12">
        <Link href="/r/sample">Read the Porchlist sample</Link>
      </p>
    </main>
  );
}
