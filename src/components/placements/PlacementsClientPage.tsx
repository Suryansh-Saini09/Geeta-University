"use client";

import React, { useState, useEffect } from "react";
import PlacementHero from "@/components/placements/PlacementHero";
import PlacementNav from "@/components/placements/PlacementNav";
import TopRecruiters from "@/components/programs/TopRecruiters";
import CareerDevelopmentCell from "@/components/placements/CareerDevelopmentCell";
import PlacementSnapshotSection from "@/components/placements/PlacementSnapshotSection";
import StudentSuccessStories from "@/components/placements/StudentSuccessStories";
import PlacementDrivesSection from "@/components/placements/PlacementDrivesSection";
import RecruiterVoicesSection from "@/components/placements/RecruiterVoicesSection";
import PlacementDayGallery from "@/components/placements/PlacementDayGallery";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import FAQSection from "@/components/programs/FAQSection";
import VideoModal from "@/components/campus-life/VideoModal";
import { placementFaqs } from "@/data/placements";

interface PlacementsClientPageProps {
  sections: Record<string, any>;
  seo: any;
}

export default function PlacementsClientPage({ sections }: PlacementsClientPageProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoConfig, setVideoConfig] = useState({
    videoId: "LqKxm1hUDbQ",
    title: "Infosys Campus Recruitment Drive at Geeta University",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  const handleOpenVideoModal = (videoId: string, title: string) => {
    setVideoConfig({
      videoId,
      title,
    });
    setIsVideoModalOpen(true);
  };

  const rawFaqs = sections.faqs?.faqs || placementFaqs;
  const formattedFaqs = rawFaqs.map((faq: any) => ({
    q: faq.q || faq.question,
    a: faq.a || faq.answer,
    category: faq.category || "Placements",
  }));

  return (
    <div className="min-w-0 overflow-x-clip bg-[#F7F9FC] text-[#0A1F44]">
      {/* 1. Hero Section & Stats */}
      <PlacementHero data={sections.hero} />

      {/* 2. Sticky Sub Navigation */}
      <PlacementNav />

      {/* 3. Top Recruiters Marquee */}
      <div id="recruiters" className="scroll-mt-[190px]">
        <TopRecruiters
          title={sections.recruiters?.title || "Top Recruiters"}
        />
      </div>

      {/* 4. Career Development Cell (CDC) */}
      <CareerDevelopmentCell data={sections.cdc} />

      {/* 5. Placement Snapshot & Package Breakdown */}
      <PlacementSnapshotSection />

      {/* 6. Student Success Stories */}
      <StudentSuccessStories />

      {/* 7. Placement Drives & Featured Videos */}
      <PlacementDrivesSection onOpenVideoModal={handleOpenVideoModal} />

      {/* 8. HR & Recruiter Testimonials */}
      <RecruiterVoicesSection />

      {/* 9. Placement Day Celebrations & Gallery */}
      <PlacementDayGallery />

      {/* 10. Canonical Legacy & Ecosystem */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText="Students and recruiters benefit from the integrated ecosystem of:"
      />

      {/* 11. Frequently Asked Questions */}
      <section id="faqs" className="w-full scroll-mt-[190px]">
        <FAQSection
          title={sections.faqs?.title || "Frequently Asked Questions (FAQs)"}
          subtitle={sections.faqs?.subtitle || "Everything you need to know about campus placements, packages, recruiting companies, and career support at Geeta University."}
          faqs={formattedFaqs}
        />
      </section>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId={videoConfig.videoId}
        title={videoConfig.title}
      />
    </div>
  );
}
