import AboutSection from "@/components/sections/AboutSection";

export const metadata = {
  title: "About Us — HexaLogic Tech Solutions",
  description: "Learn more about our mission, vision, and core values at HexaLogic Tech Solutions.",
};

export default function AboutPage() {
  return (
    <div className="pt-20 lg:pt-24 bg-surface-darkest min-h-screen">
      <AboutSection />
    </div>
  );
}
