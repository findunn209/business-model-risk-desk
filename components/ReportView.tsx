import Link from "next/link";
import type { ReactNode } from "react";
import { EvidenceRail } from "@/components/EvidenceRail";
import { FailureModes } from "@/components/FailureModes";
import { FitModuleView } from "@/components/FitModule";
import { GlanceObject } from "@/components/GlanceObject";
import { HoldPlan } from "@/components/HoldPlan";
import { PageKicker } from "@/components/PageKicker";
import { TripwireSections } from "@/components/TripwireSections";
import { planBinds, type Report } from "@/lib/report";

export function ReportView({
  report,
  identity,
}: {
  report: Report;
  identity?: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-canvas flex-1 px-6 py-12">
      {identity}
      <PageKicker className={identity ? "mt-3" : undefined} />

      <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight">
        {report.company.name}
      </h1>
      <p className="mt-3 max-w-measure leading-snug">{report.company.form}</p>
      <p className="mt-4 max-w-measure leading-relaxed">
        {report.company.claimed_model}
      </p>

      <div className="mt-10">
        <GlanceObject glance={report.glance} />
      </div>

      {report.failure_modes.length ? (
        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(13rem,1fr)] lg:gap-16">
          <FailureModes rows={report.failure_modes} />
          <EvidenceRail rows={report.failure_modes} />
        </div>
      ) : null}

      <TripwireSections sections={report.tripwire_sections} />

      {report.if_this_model_is_to_hold.length ? (
        <HoldPlan
          items={report.if_this_model_is_to_hold}
          binds={planBinds(report)}
        />
      ) : null}

      {report.fit ? <FitModuleView fit={report.fit} /> : null}

      <p className="mt-8 max-w-measure leading-relaxed">{report.notes}</p>
    </main>
  );
}

export function SampleIdentity() {
  return (
    <p className="kicker">
      Sample · labeled fiction · <Link href="/r/sample.md">Markdown</Link>
      {" ↔ "}
      HTML
    </p>
  );
}

export function LiveIdentity({ id }: { id: string }) {
  return (
    <p className="kicker">
      Evidence file · free · truncated ·{" "}
      <Link href={`/v1/reports/${id}`}>JSON</Link>
    </p>
  );
}
