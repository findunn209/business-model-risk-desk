import type { TripwireSection } from "@/lib/sample-report";

export function TripwireSections({
  sections,
}: {
  sections: TripwireSection[];
}) {
  if (!sections.length) return null;
  return (
    <div className="mt-14 max-w-measure space-y-14">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-8">
          <h2 className="section-label">{section.title}</h2>
          <p className="mt-3 leading-relaxed">{section.intro}</p>
          <ol className="mt-5 list-decimal space-y-4 pl-5">
            {section.items.map((item) => (
              <li key={item.lead} className="leading-relaxed">
                <span className="font-medium">{item.lead}.</span> {item.body}
              </li>
            ))}
          </ol>
          {section.closer ? (
            <p className="mt-5 max-w-measure leading-relaxed text-muted">
              {section.closer}
            </p>
          ) : null}
        </section>
      ))}
    </div>
  );
}
