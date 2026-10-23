import { HeroSection } from '@/components/home/HeroSection';
import { AcademicPortalsSection } from '@/components/home/AcademicPortalsSection';
import { FamilyGalleryMarquee } from '@/components/home/FamilyGalleryMarquee';
import { BottomCtaBanner } from '@/components/home/BottomCtaBanner';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AcademicPortalsSection />
      <FamilyGalleryMarquee />
      <BottomCtaBanner />
    </>
  );
}
