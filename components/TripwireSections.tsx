import { Term } from "@/components/Term";
import type { TripwireSection } from "@/lib/sample-report";

export function TripwireSections({
  sections,
}: {
  sections: TripwireSection[];
}) {
  return (
    <div className="mt-14 max-w-measure space-y-14">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-8">
          <h2 className="section-label">{section.title}</h2>
          {section.jargon?.map((item) => (
            <p
              key={item.term}
              className="mt-2 text-sm leading-relaxed text-muted"
            >
              <Term definition={item.definition}>{item.term}</Term>
              {" — "}
              {item.definition}
            </p>
          ))}
          <p className="mt-3 leading-relaxed">{section.intro}</p>
          <ol className="mt-5 list-decimal space-y-4 pl-5">
            {section.items.map((item) => (
              <li key={item.lead} className="leading-relaxed">
                <span className="font-medium">{item.lead}.</span> {item.body}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
