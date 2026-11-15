import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/features/home/components/hero-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
      </main>
      <SiteFooter />
    </>
  );
}
