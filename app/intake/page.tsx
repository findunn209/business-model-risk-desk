import type { Metadata } from "next";
import { PageKicker } from "@/components/PageKicker";
import { IntakeFlow } from "@/components/intake/IntakeFlow";

export const metadata: Metadata = {
  title: "Evidence file",
  description:
    "One fact per screen. Skip means unknown, not no. We name where this money path breaks.",
};

export default function IntakePage() {
  return (
    <>
      <div className="mx-auto w-full max-w-measure px-6 pt-8">
        <PageKicker />
      </div>
      <IntakeFlow />
    </>
  );
}
