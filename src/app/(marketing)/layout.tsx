import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-shell min-h-[100dvh] flex flex-col bg-paper text-ink relative selection:bg-accent selection:text-white">
      {/* Subtle tactile film-grain overlay (Reference 1: Leather Design Studio) */}
      <div className="ds-grainfx" aria-hidden="true" />
      <SmoothScrollProvider>
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
