import { Chip } from "@/components/Chip";
import type { Glance } from "@/lib/glance";
import {
  EVIDENCE_LABEL,
  MODEL_CONDITION_LABEL,
  TIME_TO_BREAK_LABEL,
} from "@/lib/glance";

export function GlanceObject({ glance }: { glance: Glance }) {
  return (
    <section aria-labelledby="dominant-break-label">
      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-10">
        <div className="border-l-2 border-accent pl-5">
          <p
            id="dominant-break-label"
            className="font-mono text-[11px] tracking-wide text-muted"
          >
            Dominant break
          </p>
          <p className="mt-2 font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl">
            {glance.dominant_break}
          </p>
        </div>
        <dl className="flex flex-col justify-center gap-4">
          <div className="flex flex-col gap-1.5">
            <dt className="font-mono text-[11px] tracking-wide text-muted">
              time_to_break
            </dt>
            <dd>
              <Chip>{TIME_TO_BREAK_LABEL[glance.time_to_break]}</Chip>
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="font-mono text-[11px] tracking-wide text-muted">
              evidence
            </dt>
            <dd>
              <Chip>{EVIDENCE_LABEL[glance.evidence]}</Chip>
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="font-mono text-[11px] tracking-wide text-muted">
              model_condition
            </dt>
            <dd>
              <Chip>{MODEL_CONDITION_LABEL[glance.model_condition]}</Chip>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
