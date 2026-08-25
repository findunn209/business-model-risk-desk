import type { Metadata } from "next";
import { SampleIdentity, ReportView } from "@/components/ReportView";
import { sampleReport } from "@/lib/sample-report";

export const metadata: Metadata = {
  title: `${sampleReport.company.name} (sample)`,
  description: `Frozen sample report for ${sampleReport.company.name}, a labeled-fiction marketplace. Not a real company.`,
};

export default function SampleReportPage() {
  return (
    <ReportView
      report={{ ...sampleReport, id: "sample" }}
      identity={<SampleIdentity />}
    />
  );
}
