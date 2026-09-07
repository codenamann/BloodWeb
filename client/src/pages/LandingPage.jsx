import React, { useState } from 'react';
import { Navbar, Footer } from '../components/layout';
import {
  Hero,
  WhatIsBloodWeb,
  HowItWorks,
  WhyBloodWeb,
  TwoWaysToUse,
  TrustAndSafety,
  AboutSection,
  ContactSection,
  FinalCTA,
  RequestBloodModal,
  DonateModal,
} from '../components/Landing';
import { Droplets } from 'lucide-react';

const LandingPage = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const handleOpenRequest = () => setIsRequestModalOpen(true);
  const handleOpenDonate = () => setIsDonateModalOpen(true);

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] selection:bg-[#d93829]/20 selection:text-[#d93829] font-sans">
      {/* Navigation */}
      <Navbar onRequestBlood={handleOpenRequest} onDonate={handleOpenDonate} />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section (Locked / Unmodified) */}
        <Hero onRequestBlood={handleOpenRequest} onDonate={handleOpenDonate} />

        {/* 2. What Is BloodWeb? (About BloodWeb with heart-in-hands.png) */}
        <WhatIsBloodWeb />

        {/* 3. How BloodWeb Works (4 Clear Steps with Arrows) */}
        <HowItWorks />

        {/* 4. Why BloodWeb? (4 Core Strengths Grid) */}
        <WhyBloodWeb />

        {/* 5. For Everyone (Two Ways to Use BloodWeb) */}
        <TwoWaysToUse
          onRequestBlood={handleOpenRequest}
          onDonate={handleOpenDonate}
        />

        {/* 6. Trust & Safety */}
        <TrustAndSafety />

        {/* 7. Our Mission (Why BloodWeb Exists) */}
        <AboutSection />

        {/* 8. Get In Touch */}
        <ContactSection />

        {/* 9. Final Call to Action */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <RequestBloodModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
