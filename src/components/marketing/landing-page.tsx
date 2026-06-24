import { LandingHeader } from "@/components/marketing/landing-header";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingEcosystem } from "@/components/marketing/landing-ecosystem";
import { LandingIntelligence } from "@/components/marketing/landing-intelligence";
import { LandingRoles } from "@/components/marketing/landing-roles";
import { LandingCtaFooter } from "@/components/marketing/landing-cta-footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingEcosystem />
        <LandingIntelligence />
        <LandingRoles />
      </main>
      <LandingCtaFooter />
    </div>
  );
}
