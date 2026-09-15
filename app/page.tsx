import { ParticleCanvas } from '@/components/home/ParticleCanvas';
import { HeroSection } from '@/components/home/HeroSection';
import { ValuesSection } from '@/components/home/ValuesSection';
import { QuoteSection } from '@/components/home/QuoteSection';

export default function HomePage() {
  return (
    <>
      <ParticleCanvas />
      <HeroSection />
      <ValuesSection />
      <QuoteSection />
    </>
  );
}
