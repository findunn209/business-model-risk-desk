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
          Four fields. For a first-time operator the money path breaks at
          payment onboarding, not at later off-platform leakage. Evidence is
          inferred.
        </p>
        <div className="mt-6">
          <GlanceObject glance={glance} />
        </div>
      </div>

      <div className="mt-14">
        <FailureModes rows={failure_modes} />
        <p className="mt-4 max-w-measure leading-relaxed">
          The first three sit on this cycle: payment companies will not approve
          sitting in the money, charging the homeowner is being the merchant of
          record, and anyone can sign up to do the work. Off-platform repeat
          business is later — you have to finish a first job before anyone can
          go around you. Two short sections on the report name processor
          underwrite tripwires and legal and contractable issues a first-time
          operator misses.
        </p>
      </div>

      <section className="mt-14 max-w-measure">
        <h2 className="section-label">If this model is to hold</h2>
        <p className="mt-3 leading-relaxed">
          The plan is numbered to those same breaks plus the tripwire sections:
          cash that can eat chargebacks and refunds for 90–180 days of volume,
          a processor check you can pass, treat charging the homeowner as being
          merchant of record (or charge the trade’s account / sell the
          introduction only), license and deposit rules before you scale, vet
          for payout as well as skill, and keep the next job on the platform
          or stop sitting in the charge.
        </p>
      </section>

      <p className="mt-12">
        <Link href="/r/sample">Read the Porchlist sample</Link>
      </p>
    </main>
  );
}
