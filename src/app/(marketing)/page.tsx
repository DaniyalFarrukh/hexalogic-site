import type { Metadata } from "next";
import RedSunHero from "@/components/sections/RedSunHero";
import RedSunFeatures from "@/components/sections/RedSunFeatures";

export const metadata: Metadata = {
  title: "HexaLogic Tech Solutions | Top IT Consulting & Custom Software in Lahore",
  description: "HexaLogic Tech Solutions delivers premium IT consulting, custom software, UI/UX design, and business automation in Lahore, Pakistan to scale your modern business.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <RedSunHero />
      <RedSunFeatures />
    </>
  );
}
