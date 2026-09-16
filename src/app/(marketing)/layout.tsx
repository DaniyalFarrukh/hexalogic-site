import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-darkest text-[#f4f4f5]">
      <SmoothScrollProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
