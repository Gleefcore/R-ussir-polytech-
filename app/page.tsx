import { ParticleCanvas } from '@/components/home/ParticleCanvas';
import { HeroSection } from '@/components/home/HeroSection';
import { MetricsBar } from '@/components/home/MetricsBar';
import { AboutForgexSection } from '@/components/home/AboutForgexSection';
import { EngineeringDisciplines } from '@/components/home/EngineeringDisciplines';
import { ValuesSection } from '@/components/home/ValuesSection';
import { QuoteSection } from '@/components/home/QuoteSection';
import { FamilyGalleryMarquee } from '@/components/home/FamilyGalleryMarquee';
import { BottomCtaBanner } from '@/components/home/BottomCtaBanner';

export default function HomePage() {
  return (
    <>
      <ParticleCanvas />
      <HeroSection />
      <MetricsBar />
      <AboutForgexSection />
      <EngineeringDisciplines />
      <ValuesSection />
      <QuoteSection />
      <FamilyGalleryMarquee />
      <BottomCtaBanner />
    </>
  );
}
