import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-darkest text-[#f4f4f5]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-24">
        <div className="text-center max-w-xl">
          <p className="text-brand-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">Error 404</p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 text-balance">
            We couldn&apos;t find that page.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            The link may be outdated or the page may have moved. Head back home or take a look at our work.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 min-h-[48px] bg-brand-primary hover:bg-[#ff8947] text-white font-bold rounded-xl transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center justify-center px-6 min-h-[48px] border border-white/10 hover:border-white/30 text-white font-bold rounded-xl transition-colors"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
