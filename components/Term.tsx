import type { ReactNode } from "react";

export function Term({
  children,
  definition,
  showDef = false,
}: {
  children: ReactNode;
  definition: string;
  showDef?: boolean;
}) {
  return (
    <>
      <abbr className="term" title={definition}>
        {children}
      </abbr>
      {showDef ? <span className="text-muted"> ({definition})</span> : null}
    </>
  );
}
