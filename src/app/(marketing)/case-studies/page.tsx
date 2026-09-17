import CaseStudiesSection from "@/components/sections/CaseStudiesSection";

export const metadata = {
  title: "Case Studies",
  alternates: { canonical: "/case-studies" },
  description: "Read our client stories and learn how we have delivered successful digital solutions to businesses worldwide.",
};

export default function CaseStudiesPage() {
  return (
    <div className="pt-20 lg:pt-24 bg-surface-darkest min-h-screen">
      <CaseStudiesSection />
    </div>
  );
}
