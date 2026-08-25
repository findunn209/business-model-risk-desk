import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveIdentity, ReportView } from "@/components/ReportView";
import { compileReport } from "@/lib/intake/compile";
import { decodeAnswers } from "@/lib/intake/encode";

export const dynamic = "force-dynamic";

type LivePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: LivePageProps): Promise<Metadata> {
  const { id } = await params;
  const answers = decodeAnswers(id);
  if (!answers) {
    return { title: "Evidence file" };
  }
  const report = compileReport(id, answers);
  return {
    title: report.company.name,
    description: report.glance.dominant_break,
  };
}

export default async function LiveReportPage({ params }: LivePageProps) {
  const { id } = await params;
  if (id === "sample") notFound();
  const answers = decodeAnswers(id);
  if (!answers) notFound();
  const report = compileReport(id, answers);

  return <ReportView report={report} identity={<LiveIdentity id={id} />} />;
}
