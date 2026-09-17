import type { Metadata } from "next";
import ModernContact from "@/components/sections/ModernContact";

export const metadata: Metadata = {
  title: "Contact Us",
  alternates: { canonical: "/contact" },
  description: "Get in touch with HexaLogic Tech Solutions. We're ready to hear about your next big idea.",
};

export default function ContactPage() {
  return (
    <main>
      <ModernContact />
    </main>
  );
}
