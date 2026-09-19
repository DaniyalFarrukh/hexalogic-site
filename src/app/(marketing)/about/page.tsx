import AboutSection from "@/components/sections/AboutSection";

export const metadata = {
  title: "About Us | IT Consulting & Software Development in Lahore",
  alternates: { canonical: "/about" },
  description: "Learn about HexaLogic Tech Solutions. We deliver premium IT consulting, custom software, and digital transformation services to modernize your business in Pakistan and globally.",
};

export default function AboutPage() {
  return (
    <div className="pt-20 lg:pt-24 bg-surface-darkest min-h-screen">
      <AboutSection />
    </div>
  );
}
