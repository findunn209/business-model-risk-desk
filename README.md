# Business Model Risk Desk

Public site for Business Model Risk Desk.

We do not say if you should exist. We say where this internet/app model breaks, and the plan to fix those breaks.

This repository is that public site: a Next.js App Router app in TypeScript, deployable on Vercel Hobby. There is no auth, no CMS, and no chat. Live URL assessments are not available yet.

## Pages

- `/` — homepage (wordmark, promise, Start the evidence file)
- `/intake` — human evidence-file questionnaire (one fact per screen)
- `/r/{id}` — minted HTML report from intake answers
- `/v1/intake` — `POST` JSON intake for agents; returns `report_id`
- `/v1/reports/{id}` — same report object as the HTML
- `/r/sample` — frozen sample HTML report (labeled fiction)
- `/r/sample.md` — the same assessment as markdown
- `/method` — the glance object
- `/sample` — anatomy of the sample report
- `/llms.txt` — machine-readable list of those URLs

Agents post facts they already have to `/v1/intake`. They do not walk `/intake`. Skip means unknown, not no. Omitting a field means it was not asked.

## What a report is

A report names where an internet/app model breaks, and the plan to fix those breaks. Public pages state once, as a kicker, that this is not a credit rating, investment advice, legal advice, letter grade, 0–100 score, or a verdict on whether a company should exist.

The **glance object** is four fields:

- `dominant_break`
- `time_to_break` — `already` | `this_cycle` | `later` | `unbounded_if_holds`
- `evidence` — `measured` | `inferred` | `unknown`
- `model_condition` — `breaking` | `fragile` | `contingent` | `insufficient_evidence`

Glance `dominant_break` is the first measured missing control for this money path. Tools never set the glance. If the file skipped everything that would name a break, `model_condition` is `insufficient_evidence`. Free reports are truncated; the schema is the same.

The sample uses **Porchlist**, a labeled-fake local-services marketplace. The worked glance is: You charged the homeowner without checking the worker (inferred, contingent). Charging the homeowner is merchant of record because the operator takes 100% of the payment, then pays the worker. Further failure modes: a “verified” badge is not a first-job check, off-platform repeat work. The report also has PSP underwrite tripwires and a legal-and-contractable section.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
```

Deploy the app on Vercel (Hobby is enough). No environment variables are required.
