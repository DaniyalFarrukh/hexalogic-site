import dynamic from 'next/dynamic';
import RedSunHero from "@/components/sections/RedSunHero";

// Code-split below the fold components
const RedSunFeatures = dynamic(() => import('@/components/sections/RedSunFeatures'), { ssr: true });

export default function Home() {
  return (
    <>
      <RedSunHero />
      <RedSunFeatures />
    </>
  );
}
