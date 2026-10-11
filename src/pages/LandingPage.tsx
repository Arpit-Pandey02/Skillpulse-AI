import React from 'react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { HowItWorks } from '../components/landing/HowItWorks';
import { SocialProof } from '../components/landing/SocialProof';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <PublicNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureGrid />
        <HowItWorks />
        <SocialProof />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
