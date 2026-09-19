import type { Metadata } from "next";
import ModernContact from "@/components/sections/ModernContact";

export const metadata: Metadata = {
  title: "Contact Us | HexaLogic Tech Solutions",
  alternates: { canonical: "/contact" },
  description: "Get in touch with HexaLogic for expert IT consulting, custom software development, and cloud integration. Based in Lahore, Pakistan. Let's scale your business.",
};

export default function ContactPage() {
  return (
    <main>
      <ModernContact />
    </main>
  );
}
