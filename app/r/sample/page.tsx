import type { Metadata } from "next";
import Link from "next/link";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { GlanceObject } from "@/components/GlanceObject";
import { FailureModes } from "@/components/FailureModes";
import { sampleReport } from "@/lib/sample-report";

export const metadata: Metadata = {
  title: `${sampleReport.company.name} (sample)`,
  description: `Frozen sample report for ${sampleReport.company.name}, a labeled-fiction marketplace. Not a real company.`,
};

export default function SampleReportPage() {
  const report = sampleReport;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <p className="text-sm text-muted">
        Sample report · labeled fiction · not a real company ·{" "}
        <Link href="/r/sample.md">Markdown</Link>
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight">
        {report.company.name}
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-snug">{report.company.form}</p>

      <div className="mt-8">
        <DisclaimerBanner />
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          Claimed internet/app model
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed">
          {report.company.claimed_model}
        </p>
      </section>

      <div className="mt-14">
        <GlanceObject glance={report.glance} />
      </div>

      <div className="mt-14">
        <FailureModes rows={report.failure_modes} />
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          If this model is to hold
        </h2>
        <ol className="mt-4 max-w-xl list-decimal space-y-3 pl-5 leading-relaxed">
          {report.if_this_model_is_to_hold.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <p className="mt-6 max-w-xl leading-relaxed">{report.notes}</p>
      </section>
    </main>
  );
}
