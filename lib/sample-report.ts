import { DISCLAIMER, PROMISE, SITE_NAME } from "./site";
import type { Evidence, Glance, TimeToBreak } from "./glance";

export type KillRow = {
  kill: string;
  how_it_ends_the_model: string;
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
  kills: KillRow[];
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
    dominant_kill: "Post-match disintermediation",
    time_to_break: "this_cycle",
    evidence: "inferred",
    model_condition: "fragile",
  },
  kills: [
    {
      kill: "Post-match disintermediation",
      how_it_ends_the_model:
        "After the first booked job, the homeowner and the trade exchange numbers. Repeat work never returns. The 18% take-rate is a tax on first contact, not a tax on the relationship the model claims to own.",
      time_to_break: "this_cycle",
      evidence: "inferred",
    },
    {
      kill: "First-job unit economics",
      how_it_ends_the_model:
        "Paid homeowner acquisition costs more than the platform’s cut of a typical small job. Without repeat capture, contribution does not close. This follows from bypass; it does not require a separate scandal.",
      time_to_break: "this_cycle",
      evidence: "inferred",
    },
    {
      kill: "Supply quality unwind",
      how_it_ends_the_model:
        "Competent trades leave once they have a book of off-platform regulars. What remains is new, unvetted, or desperate inventory. Homeowners learn this once, then stop opening the app.",
      time_to_break: "later",
      evidence: "inferred",
    },
    {
      kill: "Liability as employer or contractor",
      how_it_ends_the_model:
        "A serious injury or property claim can reclassify the platform as the employer or the general contractor. Insurance then becomes the product. The marketplace story does not survive that shift.",
      time_to_break: "later",
      evidence: "unknown",
    },
    {
      kill: "Demand capture by search and incumbents",
      how_it_ends_the_model:
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
    "Until one of those is true, “marketplace” here is a customer-acquisition funnel with a leak at the first handshake. We do not score Porchlist as a company. We describe how this internet/app model dies.",
};

export function sampleReportMarkdown(): string {
  const r = sampleReport;
  const glanceBlock = [
    "```",
    `dominant_kill: ${r.glance.dominant_kill}`,
    `time_to_break: ${r.glance.time_to_break}`,
    `evidence: ${r.glance.evidence}`,
    `model_condition: ${r.glance.model_condition}`,
    "```",
  ].join("\n");

  const killHeader =
    "| Kill | How it ends the model | time_to_break | evidence |";
  const killDivider = "| --- | --- | --- | --- |";
  const killRows = r.kills
    .map(
      (row) =>
        `| ${row.kill} | ${row.how_it_ends_the_model} | ${row.time_to_break} | ${row.evidence} |`,
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
    "## Kill table",
    "",
    killHeader,
    killDivider,
    killRows,
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
