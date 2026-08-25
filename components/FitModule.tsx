import type { FitModule } from "@/lib/report";

export function FitModuleView({ fit }: { fit: FitModule }) {
  return (
    <section aria-labelledby="fit-heading" className="mt-14 max-w-measure">
      <h2 id="fit-heading" className="section-label">
        What tends to fit this file
      </h2>
      <p className="mt-3 leading-relaxed text-muted">{fit.intro}</p>
      <ol className="mt-5 list-decimal space-y-4 pl-5">
        {fit.items.map((item) => (
          <li key={item.id} className="leading-relaxed">
            <span className="font-medium">{item.title}.</span> {item.body}
          </li>
        ))}
      </ol>
    </section>
  );
}
