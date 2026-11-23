import type { Metadata } from "next";
import { Suspense } from "react";
import Dialer from "@/components/dialer/Dialer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Voice Dialer",
  description: "HexaLogic cloud voice dialer.",
};

export default function DialerPage() {
  const dialerKey = process.env.DIALER_ACCESS_KEY ?? "";

  return (
    <Suspense
      fallback={
        <p
          style={{
            textAlign: "center",
            paddingTop: "9rem",
            paddingBottom: "5rem",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ds-soft)",
          }}
        >
          Loading Hexalogic Dialer...
        </p>
      }
    >
      <Dialer dialerKey={dialerKey} />
    </Suspense>
  );
}
