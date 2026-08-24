import { PAGE_KICKER, PROMISE, SITE_NAME } from "./site";
import { FAILURE_MODE_DEFINITION } from "./glance";
import type { Evidence, Glance, TimeToBreak } from "./glance";

export type JargonDef = {
  term: string;
  definition: string;
};

export type FailureModeRow = {
  id: string;
  failure_mode: string;
  how_the_model_breaks: string;
  time_to_break: TimeToBreak;
  evidence: Evidence;
  jargon?: JargonDef[];
};

export type HoldPlanItem = {
  failure_mode_id: string;
  text: string;
};

export type TripwireItem = {
  lead: string;
  body: string;
};

export type TripwireSection = {
  id: string;
  title: string;
  plan_label: string;
  intro: string;
  items: TripwireItem[];
  jargon?: JargonDef[];
  closer?: string;
};

export type PlanBind = {
  id: string;
  label: string;
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
  tripwire_sections: TripwireSection[];
  if_this_model_is_to_hold: HoldPlanItem[];
  notes: string;
};

export function planBinds(report: SampleReport): PlanBind[] {
  return [
    ...report.failure_modes.map((row) => ({
      id: row.id,
      label: row.failure_mode,
    })),
    ...report.tripwire_sections.map((section) => ({
      id: section.id,
      label: section.plan_label,
    })),
  ];
}

export const sampleReport: SampleReport = {
  slug: "sample",
  labeled_fiction: true,
  company: {
    name: "Porchlist",
    form: "Two-sided marketplace matching homeowners with independent tradespeople for small residential jobs.",
    claimed_model:
      "Homeowners find a plumber, electrician, or handyman in the app and pay in the app. The platform takes 18% of jobs booked there. Homeowners are bought with paid search. Trades are supposed to stay for scheduling, invoicing, and a “verified” badge.",
  },
  glance: {
    dominant_break: "Payment companies will not approve sitting in the money",
    time_to_break: "this_cycle",
    evidence: "inferred",
    model_condition: "contingent",
  },
  failure_modes: [
    {
      id: "psp-balance-sheet",
      failure_mode: "Payment companies will not approve sitting in the money",
      how_the_model_breaks:
        "Porchlist wants to take the homeowner’s card, keep 18%, and pay the worker later. That is sitting in the money. Processors will not treat it as a small raise of an existing limit. It is a new yes-or-no on whether Porchlist may hold customer funds (a new underwrite). Some treat home services plus deposits as high-risk. Book today, job Saturday, often a deposit: they treat delayed fulfillment like travel — a reserve, a payout delay, a hold until the work is done. Paying the trade before the chargeback window closes means Porchlist eats a vanished seller. “Stronger balance sheet” here means cash to eat chargebacks and refunds for 90–180 days of volume, not a prettier cap table. Until a processor says yes, the 18% take does not exist. The money path breaks at onboarding.",
      time_to_break: "this_cycle",
      evidence: "inferred",
      jargon: [
        {
          term: "PSP",
          definition:
            "Payment service provider. Stripe, Adyen, and the like: they move card money and decide who is allowed to hold customer funds.",
        },
      ],
    },
    {
      id: "merchant-of-record",
      failure_mode: "Charging the homeowner is being the merchant of record",
      how_the_model_breaks:
        "If Porchlist takes about 18% on jobs booked in-app, they are in the charge. Collecting the homeowner’s card and paying the trade later is being the merchant of record, even if the copy says marketplace. The bank statement says PORCHLIST, not the plumber. Services have no tracking number, so a homeowner can keep the work and still reverse the card (friendly fraud). Refunds and support land on whoever is merchant of record. Then a dual dispute: the homeowner reverses the job and the trade fights a reversed payout. The only real “platform, customer service sits with the trade” path is charging the trade’s own merchant account directly — not collecting the homeowner card and calling the worker’s payout account a pass-through.",
      time_to_break: "this_cycle",
      evidence: "inferred",
      jargon: [
        {
          term: "merchant of record",
          definition:
            "The company the customer paid — the name on the card statement. They must issue refunds and fight chargebacks.",
        },
      ],
    },
    {
      id: "vetting",
      failure_mode: "No check that the worker is real or can do the work",
      how_the_model_breaks:
        "The app does not say how Porchlist knows a plumber is a plumber. Anyone can sign up. A “verified” badge is not a check that the person is real, can do the work, or is not fraudulent. Vetting is also the check before a payout: fake trades, stolen identity, first-job deposit theft. A skill failure comes back as a chargeback. Fraud comes back as a card-network flag. If Porchlist is merchant of record, they eat both. Bad first jobs are how homeowners learn not to open the app.",
      time_to_break: "this_cycle",
      evidence: "inferred",
      jargon: [
        {
          term: "KYC",
          definition:
            "Know your customer: the check that the person receiving a payout is real and owns that account.",
        },
      ],
    },
    {
      id: "off-platform-repeat",
      failure_mode: "After the first job they stop paying the platform",
      how_the_model_breaks:
        "After the first job, the worker and the homeowner deal with each other directly and stop paying the platform (disintermediation). The next gutter cleaning, the cousin’s house, the winter leak — none of that 18% comes back. This leak is real, and it is later than the breaks above: you have to finish a first job before anyone can go around you.",
      time_to_break: "later",
      evidence: "inferred",
    },
  ],
  tripwire_sections: [
    {
      id: "psp-underwrite-tripwires",
      title: "PSP underwrite tripwires",
      plan_label: "PSP underwrite tripwires",
      intro:
        "A processor is not grading whether Porchlist is a good business. They are deciding whether to let you take cards, and on what leash. Home-services marketplaces fail that check when they sit in the money, pay trades before the dispute window closes, or describe themselves as a platform while they are the merchant.",
      jargon: [
        {
          term: "KYB",
          definition:
            "Know your business: they check the company is real, who owns it, and where the money would sit.",
        },
        {
          term: "MATCH",
          definition:
            "A list processors share of merchants they terminated. The next processor can see you on it.",
        },
        {
          term: "rolling reserve",
          definition:
            "The processor holds back a slice of each job for a period, as cash against refunds and chargebacks.",
        },
        {
          term: "PayFac",
          definition:
            "Payment facilitator: you sit in the money and pay many sellers from one pot. They underwrite that as a platform, not a single shop.",
        },
      ],
      items: [
        {
          lead: "Assumption on this sample",
          body: "Porchlist takes the homeowner’s card (or sits in the money on some jobs), then pays the trade later. If the product never touches the card, the underwrite changes. Merchant of record is who charges the homeowner. Direct charge to the trade’s own merchant account is the only true platform path.",
        },
        {
          lead: "What they need to see",
          body: "A legal entity, beneficial owners, and a matching bank account (KYB). A site that says what you sell, when the job happens, refunds and cancellations, and whose name is on the statement. One honest description: take the card and pay trades, or a lead fee only — mixing those is a review trigger. Merchant, platform, or sitting in the money. Job later versus pay out now: deposit versus full prepay versus pay-on-completion, and days between charge and job. Who refunds. Warranty or guaranteed work. How often cards get reversed on this kind of work (chargeback mix). MATCH. If you pay trades: payout identity checks, a volume forecast, and a balance sheet for 90–180 days of chargebacks after the trade is already paid. No history means they treat you as a new high-ticket contractor marketplace, not ordinary software billing.",
        },
        {
          lead: "What fails",
          body: "Home services plus deposits are often high-risk. Refunds lag and there is no cash for a reserve. A first-time operator has no processing history. Calling yourself a platform while you are merchant of record (PORCHLIST on the charge). Deposits for jobs weeks out with thin refunds — delayed fulfillment, like travel. No customer-service path. Paying trades instantly while disputes last months. Unverified trades (stolen identity or stolen cards); “we have reviews” is not vetting. Roofing, HVAC, large deposits, negative-option plans, or stored value without saying so. MATCH, or hopping from a terminated contractor merchant account into a “marketplace.”",
        },
        {
          lead: "Terms if they say yes",
          body: "Typical, not a promise. Selling the introduction and never taking the homeowner card is closer to a normal merchant account — charging the trade a lead fee still needs a clean statement name. If Porchlist takes the card: a marketplace review, delayed or held payouts for 7–30 days, a rolling reserve of 5–10% or more with a 90–180 day tail, higher fees than software billing, a personal guarantee on a new entity, and volume caps. Paying many trades from one pot is a platform / PayFac underwrite; they can freeze the whole platform.",
        },
        {
          lead: "The termination path operators miss",
          body: "Disputes or MATCH can end the account and list you. That listing follows the company — and sometimes the people — to the next processor.",
        },
      ],
    },
    {
      id: "legal-and-contractable",
      title: "Legal and contractable",
      plan_label: "Legal and contractable",
      intro:
        "US home-services marketplace. Short, not a treatise. What a first-time operator misses.",
      jargon: [
        {
          term: "money transmission",
          definition:
            "Moving other people’s money as a business — often a licensed activity.",
        },
        {
          term: "MCC",
          definition:
            "Merchant category code: the processor’s label for what you actually sell, taken from volume, not from the pitch.",
        },
      ],
      items: [
        {
          lead: "Taking the homeowner’s money",
          body: "If you collect the card and pay the trade later, payments lawyers may treat you as money transmission and as merchant of record.",
        },
        {
          lead: "Who the homeowner thinks they hired",
          body: "You are not a licensed-contractor marketplace just because you list plumbers. Their license is not yours. Selling the introduction (the pro pays for a contact) is not the same as arranging the job and taking the money. If you price the job, are party to the contract, or take payment, states treat you more like a contractor than an app. Licensed trades (plumbing, electrical, HVAC, roofing) still need their licenses. Listing an unlicensed one is your problem too.",
        },
        {
          lead: "Deposits and delayed jobs",
          body: "Book today, job Saturday, a deposit. That makes the money-transmission and merchant-of-record read worse, not better. Home-improvement rules often cap down payments (example: California, $1,000 or 10%, whichever is less) and require a written contract. If you are merchant of record, checkout is the down payment. “We held it for the pro” does not erase that.",
        },
        {
          lead: "Worker classification",
          body: "Prop 22 is rideshare, not cleaners and plumbers. California’s ABC test is the one home-services platforms lose if the product is the home service. Budget payroll if you need employees. Independent contractors still get litigated.",
        },
        {
          lead: "“Vetted / insured / bonded” is a claim",
          body: "If the check is old, the policy lapsed, or you did not verify the license for this job, that is a false-advertising problem. Background checks at scale have a federal process (FCRA). Requiring a certificate of insurance is not the same as you insuring the job.",
        },
        {
          lead: "Holding customer money",
          body: "Holding funds until the job is done can be money transmission or stored value. Do not keep homeowner funds in the operating account. No Porchlist Cash wallet without counsel.",
        },
        {
          lead: "Payments legal",
          body: "The processor contract will demand a payout identity check (KYC), a refund policy, and they can dump you. They will pick an MCC from actual volume (HVAC, plumbing, roofing, cleaning), not the pitch. They refuse unlicensed home improvement, large deposits months before work, washing the category code, and guarantees you cannot evidence. One payments story on the receipt: either you sell the job or the pro is the merchant. Mixing both fails underwriting and contractor law in the same quarter.",
        },
        {
          lead: "Before you scale",
          body: "License gate by trade and ZIP before the card is charged. Small deposit tied to work. Payout delay plus proof the job was done. Consent for SMS and email. No stored-value wallet.",
        },
      ],
    },
  ],
  if_this_model_is_to_hold: [
    {
      failure_mode_id: "psp-balance-sheet",
      text: "Capitalize in cash that can eat chargebacks and refunds for 90–180 days of volume. Sitting in the money is a new yes-or-no from the processor, not a limit bump. If that cash is not there, this is not an on-platform take-rate business.",
    },
    {
      failure_mode_id: "psp-underwrite-tripwires",
      text: "Apply with one honest story — take the card and pay trades, or a lead fee only, not both. Entity, owners, matching bank, a refund policy, and statement name on the site. Do not hop a terminated contractor account into a marketplace. A dump can put you on MATCH.",
    },
    {
      failure_mode_id: "psp-underwrite-tripwires",
      text: "If they say yes, budget delayed or held payouts, a rolling reserve with a 90–180 day tail, a personal guarantee, and volume caps. Do not pay trades before the dispute window closes.",
    },
    {
      failure_mode_id: "merchant-of-record",
      text: "If you charge the homeowner, you are the merchant of record: staff refunds, chargebacks, and support as the product. The only way customer service sits with the trade is to charge the trade’s own merchant account. The real off-ramp is a software or intro fee on the trade’s card or invoice — selling the introduction. Do not sit between homeowner and trade.",
    },
    {
      failure_mode_id: "legal-and-contractable",
      text: "License gate by trade and ZIP before the card is charged. Small deposit tied to work. Payout delay plus proof the job was done. No stored-value wallet. Do not keep homeowner funds in the operating account.",
    },
    {
      failure_mode_id: "legal-and-contractable",
      text: "One payments story on the receipt: either you sell the job or the pro is the merchant. Expect the processor contract to demand KYC and a refund policy — they can dump you. Get a lawyer on money transmission, deposits, and worker classification before you scale.",
    },
    {
      failure_mode_id: "vetting",
      text: "Vet workers before they see a homeowner and before they receive a payout: they are a real person, they can do the work, the payout account is theirs. A signup and a “verified” badge is not that check. “We have reviews” is not vetting.",
    },
    {
      failure_mode_id: "off-platform-repeat",
      text: "Keep the next job on the platform — warranty, materials, the follow-up visit booked in-app — or stop sitting in the charge and sell the introduction only.",
    },
  ],
  notes:
    "Until those are true, the 18% marketplace is a sketch of sitting in the money without a processor yes, the cash, or a way to know who is on the truck. Evidence on this sample is inferred. Porchlist is labeled fiction.",
};

function jargonLine(row: { jargon?: JargonDef[] }): string {
  if (!row.jargon?.length) return "";
  return row.jargon.map((item) => `${item.term} — ${item.definition}`).join(" ");
}

function tripwireMarkdown(section: TripwireSection): string {
  const gloss = jargonLine(section);
  const items = section.items
    .map((item) => `- **${item.lead}.** ${item.body}`)
    .join("\n");
  const head = gloss
    ? [`## ${section.title}`, "", gloss, "", section.intro, ""]
    : [`## ${section.title}`, "", section.intro, ""];
  const tail = section.closer ? ["", `*${section.closer}*`, ""] : [""];
  return [...head, items, ...tail].join("\n");
}

export function sampleReportMarkdown(): string {
  const r = sampleReport;
  const binds = planBinds(r);
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
    .map((row) => {
      const gloss = jargonLine(row);
      const how = gloss
        ? `${gloss} ${row.how_the_model_breaks}`
        : row.how_the_model_breaks;
      return `| ${row.failure_mode} | ${how} | ${row.time_to_break} | ${row.evidence} |`;
    })
    .join("\n");

  const tripwires = r.tripwire_sections.map(tripwireMarkdown).join("\n");

  const plan = r.if_this_model_is_to_hold
    .map((item, index) => {
      const bind = binds.find((row) => row.id === item.failure_mode_id);
      const bound = bind ? ` (${bind.label})` : "";
      return `${index + 1}. ${item.text}${bound}`;
    })
    .join("\n");

  return [
    `# ${r.company.name}`,
    "",
    `*Labeled fiction. Not a real company. Frozen sample from ${SITE_NAME}.*`,
    "",
    `*[HTML report](/r/sample)*`,
    "",
    `> ${PAGE_KICKER}`,
    "",
    r.company.form,
    "",
    "## Claimed internet/app model",
    "",
    r.company.claimed_model,
    "",
    "## Glance",
    "",
    glanceBlock,
    "",
    "## Failure modes",
    "",
    FAILURE_MODE_DEFINITION,
    "",
    failureHeader,
    failureDivider,
    failureRows,
    "",
    tripwires.trimEnd(),
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
