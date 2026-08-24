import { DISCLAIMER, PROMISE, SITE_NAME } from "./site";
import type { Evidence, Glance, TimeToBreak } from "./glance";

export type FailureModeRow = {
  failure_mode: string;
  how_the_model_breaks: string;
  time_to_break: TimeToBreak;
  evidence: Evidence;
};

export type SampleReport = {
  slug: "sample";
  labeled_fiction: true;
  company: {
    name: string;
    form: string;
    claimed_model: string;
  };
  glance: Glance;
  failure_modes: FailureModeRow[];
  if_this_model_is_to_hold: string[];
  notes: string;
};

export const sampleReport: SampleReport = {
  slug: "sample",
  labeled_fiction: true,
  company: {
    name: "Porchlist",
    form: "Two-sided marketplace matching homeowners with independent tradespeople for small residential jobs.",
    claimed_model:
      "Homeowners find a plumber, electrician, or handyman in the app. The platform takes 18% of jobs booked in-app. Homeowners are bought with paid search. Trades are supposed to stay for scheduling, invoicing, and a “verified” badge.",
  },
  glance: {
    dominant_break: "Post-match disintermediation",
    time_to_break: "this_cycle",
    evidence: "inferred",
    model_condition: "fragile",
  },
  failure_modes: [
    {
      failure_mode: "Post-match disintermediation",
      how_the_model_breaks:
        "After the first booked job, the homeowner and the trade exchange numbers. Repeat work never returns. The 18% take-rate is a tax on first contact, not a tax on the relationship the model claims to own.",
      time_to_break: "this_cycle",
      evidence: "inferred",
    },
    {
      failure_mode: "First-job unit economics",
      how_the_model_breaks:
        "Paid homeowner acquisition costs more than the platform’s cut of a typical small job. Without repeat capture, contribution does not close. This follows from bypass; it does not require a separate scandal.",
      time_to_break: "this_cycle",
      evidence: "inferred",
    },
    {
      failure_mode: "Supply quality unwind",
      how_the_model_breaks:
        "Competent trades leave once they have a book of off-platform regulars. What remains is new, unvetted, or desperate inventory. Homeowners learn this once, then stop opening the app.",
      time_to_break: "later",
      evidence: "inferred",
    },
    {
      failure_mode: "Liability as employer or contractor",
      how_the_model_breaks:
        "A serious injury or property claim can reclassify the platform as the employer or the general contractor. Insurance then becomes the product. The marketplace story does not hold after that shift.",
      time_to_break: "later",
      evidence: "unknown",
    },
    {
      failure_mode: "Demand capture by search and incumbents",
      how_the_model_breaks:
        "“I need someone today” is already served by search ads, incumbent directories, and neighborhood groups. A thin marketplace that does not own the repeat relationship has no defensive query.",
      time_to_break: "later",
      evidence: "inferred",
    },
  ],
  if_this_model_is_to_hold: [
    "Stop treating the take-rate as a tax on ongoing work the platform does not own. Charge once for an introduction, then sell tools a trade would pay for after they already have the homeowner’s number.",
    "Or become the contractor of record: bonded jobs, employed or exclusive supply. That is a different business than a marketplace.",
    "Or own a SKU the job cannot bypass—parts, materials, warranty—so the platform remains inside the transaction after the handshake.",
  ],
  notes:
    "Until one of those is true, “marketplace” here is a customer-acquisition funnel with a leak at the first handshake. We do not score Porchlist as a company. We describe where this internet/app model breaks.",
};

export function sampleReportMarkdown(): string {
  const r = sampleReport;
  const glanceBlock = [
    "```",
    `dominant_break: ${r.glance.dominant_break}`,
    `time_to_break: ${r.glance.time_to_break}`,
    `evidence: ${r.glance.evidence}`,
    `model_condition: ${r.glance.model_condition}`,
    "```",
  ].join("\n");

  const failureHeader =
    "| Break | How the model breaks | time_to_break | evidence |";
  const failureDivider = "| --- | --- | --- | --- |";
  const failureRows = r.failure_modes
    .map(
      (row) =>
        `| ${row.failure_mode} | ${row.how_the_model_breaks} | ${row.time_to_break} | ${row.evidence} |`,
    )
    .join("\n");

  const plan = r.if_this_model_is_to_hold
    .map((item) => `- ${item}`)
    .join("\n");

  return [
    `# ${r.company.name}`,
    "",
    `*Labeled fiction. Not a real company. Frozen sample from ${SITE_NAME}.*`,
    "",
    `> ${DISCLAIMER}`,
    "",
    r.company.form,
    "",
    "## Claimed internet/app model",
    "",
    r.company.claimed_model,
    "",
    "## Glance",
    "",
    "Not a 0–100 score. Not a letter grade. Not Clear / Watch / Blocked as credit.",
    "",
    glanceBlock,
    "",
    "## Failure modes",
    "",
    failureHeader,
    failureDivider,
    failureRows,
    "",
    "## If this model is to hold",
    "",
    plan,
    "",
    r.notes,
    "",
    "---",
    "",
    PROMISE,
    "",
  ].join("\n");
}
