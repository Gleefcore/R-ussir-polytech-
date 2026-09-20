import { HeroSection } from '@/components/home/HeroSection';
import { QuickAccessGrid } from '@/components/home/QuickAccessGrid';
import { PillarsSection } from '@/components/home/PillarsSection';
import { FamilyGalleryMarquee } from '@/components/home/FamilyGalleryMarquee';
import { BottomCtaBanner } from '@/components/home/BottomCtaBanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickAccessGrid />
      <PillarsSection />
      <FamilyGalleryMarquee />
      <BottomCtaBanner />
    </>
  );
}
