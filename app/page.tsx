import { ParticleCanvas } from '@/components/home/ParticleCanvas';
import { HeroSection } from '@/components/home/HeroSection';
import { MetricsBar } from '@/components/home/MetricsBar';
import { AboutForgexSection } from '@/components/home/AboutForgexSection';
import { CapabilitiesSection } from '@/components/home/CapabilitiesSection';
import { EngineeringIndustries } from '@/components/home/EngineeringIndustries';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { FamilyGalleryMarquee } from '@/components/home/FamilyGalleryMarquee';
import { BottomCtaBanner } from '@/components/home/BottomCtaBanner';

export default function HomePage() {
  return (
    <>
      <ParticleCanvas />
      <HeroSection />
      <MetricsBar />
      <AboutForgexSection />
      <CapabilitiesSection />
      <EngineeringIndustries />
      <FeaturedProjects />
      <FamilyGalleryMarquee />
      <BottomCtaBanner />
    </>
  );
}
