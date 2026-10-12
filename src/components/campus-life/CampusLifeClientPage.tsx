"use client";

import React, { useState, useEffect } from "react";
import CampusLifeHero from "@/components/campus-life/CampusLifeHero";
import CampusLifeNav from "@/components/campus-life/CampusLifeNav";
import InfrastructureSection from "@/components/campus-life/InfrastructureSection";
import SportsFacilitiesSection from "@/components/campus-life/SportsFacilitiesSection";
import CampusEventsSection from "@/components/campus-life/CampusEventsSection";
import EminentPersonalitiesSection from "@/components/campus-life/EminentPersonalitiesSection";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import FAQSection from "@/components/programs/FAQSection";
import VideoModal from "@/components/campus-life/VideoModal";
import { campusFaqs } from "@/data/campusLife";

interface CampusLifeClientPageProps {
  sections: Record<string, any>;
  seo: any;
}

export default function CampusLifeClientPage({ sections }: CampusLifeClientPageProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoConfig, setVideoConfig] = useState({
    videoId: "arnFS6rf454",
    title: "Geeta University Virtual Campus Tour",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  const openVirtualTourModal = () => {
    setVideoConfig({
      videoId: "arnFS6rf454",
      title: "Geeta University Virtual Campus Tour",
    });
    setIsVideoModalOpen(true);
  };

  const openEventsVideoModal = () => {
    const spotlightVideoUrl = sections.events?.videoSpotlight?.videoUrl || "D-TW0dcqMDA";
    const spotlightTitle = sections.events?.videoSpotlight?.title || "Geeta University Campus Events Glimpse";
    setVideoConfig({
      videoId: spotlightVideoUrl,
      title: spotlightTitle,
    });
    setIsVideoModalOpen(true);
  };

  const rawFaqs = sections.faqs?.faqs || campusFaqs.map((f) => ({ q: f.question, a: f.answer }));
  const formattedFaqs = rawFaqs.map((faq: any) => ({
    q: faq.question || faq.q,
    a: faq.answer || faq.a,
    category: "Campus Life",
  }));

  return (
    <div className="min-w-0 overflow-x-clip bg-[#F7F9FC] text-[#0A1F44]">
      {/* 1. Hero Banner & Overview */}
      <CampusLifeHero data={sections.hero} onOpenVirtualTour={openVirtualTourModal} />

      {/* 2. Sticky Sub Navigation */}
      <CampusLifeNav />

      {/* 3. World Class Infrastructure */}
      <InfrastructureSection data={sections.facilities} onOpenVirtualTour={openVirtualTourModal} />

      {/* 4. Sports Facilities */}
      <SportsFacilitiesSection data={sections.sports} />

      {/* 5. Campus Events & Fests */}
      <CampusEventsSection data={sections.events} onOpenEventsVideo={openEventsVideoModal} />

      {/* 6. Eminent Personalities at GU */}
      <EminentPersonalitiesSection data={sections.personalities} />

      {/* 7. Frequently Asked Questions */}
      <section id="faqs" className="w-full scroll-mt-[190px]">
        <FAQSection
          title={sections.faqs?.title || "Frequently Asked Questions"}
          subtitle={sections.faqs?.subtitle || "Find answers to common questions about hostel accommodation, sports facilities, security, and vibrant student life at Geeta University."}
          faqs={formattedFaqs}
        />
      </section>

      {/* 8. Legacy & Ecosystem */}
      <LegacyEcosystem />

      {/* Responsive Video Modal Player */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId={videoConfig.videoId}
        title={videoConfig.title}
      />
    </div>
  );
}
