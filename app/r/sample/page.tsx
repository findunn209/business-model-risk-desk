import type { Metadata } from "next";
import Link from "next/link";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { EvidenceRail } from "@/components/EvidenceRail";
import { FailureModes } from "@/components/FailureModes";
import { GlanceObject } from "@/components/GlanceObject";
import { HoldPlan } from "@/components/HoldPlan";
import { sampleReport } from "@/lib/sample-report";

export const metadata: Metadata = {
  title: `${sampleReport.company.name} (sample)`,
  description: `Frozen sample report for ${sampleReport.company.name}, a labeled-fiction marketplace. Not a real company.`,
};

export default function SampleReportPage() {
  const report = sampleReport;

  return (
    <main className="mx-auto w-full max-w-canvas flex-1 px-6 py-12">
      <p className="kicker">
        Sample · labeled fiction ·{" "}
        <Link href="/r/sample.md">Markdown</Link>
        {" ↔ "}
        HTML
      </p>
      <div className="mt-3">
        <DisclaimerBanner />
      </div>

      <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight">
        {report.company.name}
      </h1>
      <p className="mt-3 max-w-measure leading-snug">{report.company.form}</p>

      <div className="mt-10">
        <GlanceObject glance={report.glance} />
      </div>
      <p className="kicker mt-6 max-w-measure">
        Not a 0–100 score. Not a letter grade. Not Clear / Watch / Blocked as
        credit. Dominant break is the failure mode most likely to break this
        model as drawn. Rows are breaks; they are not rolled into a company
        total.
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(13rem,1fr)] lg:gap-16">
        <FailureModes rows={report.failure_modes} />
        <EvidenceRail rows={report.failure_modes} />
      </div>

      <HoldPlan
        items={report.if_this_model_is_to_hold}
        modes={report.failure_modes}
      />
      <p className="mt-8 max-w-measure leading-relaxed">{report.notes}</p>
    </main>
  );
}
