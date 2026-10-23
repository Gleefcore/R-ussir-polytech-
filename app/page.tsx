import { HeroSection } from '@/components/home/HeroSection';
import { CurriculumCatalogSection } from '@/components/home/CurriculumCatalogSection';
import { FamilyGalleryMarquee } from '@/components/home/FamilyGalleryMarquee';
import { BottomCtaBanner } from '@/components/home/BottomCtaBanner';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CurriculumCatalogSection />
      <FamilyGalleryMarquee />
      <BottomCtaBanner />
    </>
  );
}
