import { ParticleCanvas } from '@/components/home/ParticleCanvas';
import { HeroSection } from '@/components/home/HeroSection';
import { EngineeringDisciplines } from '@/components/home/EngineeringDisciplines';
import { LabShowcase } from '@/components/home/LabShowcase';
import { ValuesSection } from '@/components/home/ValuesSection';
import { QuoteSection } from '@/components/home/QuoteSection';
import { FamilyGalleryMarquee } from '@/components/home/FamilyGalleryMarquee';

export default function HomePage() {
  return (
    <>
      <ParticleCanvas />
      <HeroSection />
      <EngineeringDisciplines />
      <LabShowcase />
      <ValuesSection />
      <QuoteSection />
      <FamilyGalleryMarquee />
    </>
  );
}
