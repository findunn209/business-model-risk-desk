# Business Model Risk Desk

Public site for Business Model Risk Desk.

We do not say if you should exist. We say how this internet/app model dies and the plan to change it.

This repository is that public site: a Next.js App Router app in TypeScript, deployable on Vercel Hobby. There is no auth, no CMS, and no chat. Live URL assessments are not available yet.

## Pages

- `/` — homepage shell (wordmark, promise, disabled URL field)
- `/r/sample` — frozen sample HTML report (labeled fiction)
- `/r/sample.md` — the same assessment as markdown
- `/method` — the glance object; we refuse a company score
- `/sample` — anatomy of the sample report
- `/llms.txt` — machine-readable list of those URLs

## What a report is

A report is not a credit rating, not investment advice, and not a verdict on whether a company should exist. It is not a 0–100 score, a letter grade, or a Clear / Watch / Blocked credit label.

The **glance object** is four fields:

- `dominant_kill`
- `time_to_break` — `already` | `this_cycle` | `later` | `unbounded_if_holds`
- `evidence` — `measured` | `inferred` | `unknown`
- `model_condition` — `breaking` | `fragile` | `contingent` | `insufficient_evidence`

The sample uses **Porchlist**, a labeled-fake local-services marketplace.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
```

Deploy the app on Vercel (Hobby is enough). No environment variables are required.
