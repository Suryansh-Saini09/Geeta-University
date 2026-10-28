"use client";

import React from "react";
import type { EdgePageData } from "@/data/edge/types";
import EdgeHero from "./EdgeHero";
import EdgeTimeline from "./EdgeTimeline";
import EdgeTrainingModel from "./EdgeTrainingModel";
import EdgeStats from "./EdgeStats";
import EdgeFeatureGrid from "./EdgeFeatureGrid";
import EdgeMentors from "./EdgeMentors";
import EdgeVideoSection from "./EdgeVideoSection";
import EdgeAccordion from "./EdgeAccordion";
import EdgeTestimonials from "./EdgeTestimonials";
import EdgeGallery from "./EdgeGallery";
import EdgeCTA from "./EdgeCTA";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

interface EdgePageProps {
  data: EdgePageData;
}

export default function EdgePage({ data }: EdgePageProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <EdgeHero hero={data.hero} />

      {/* 2. Timeline Section (e.g. DYOD 5-Step Process) */}
      {data.timeline && <EdgeTimeline section={data.timeline} />}

      {/* 3. Training Model Section (e.g. GFS 3-Stage Training Model) */}
      {data.trainingModel && <EdgeTrainingModel section={data.trainingModel} />}

      {/* 4. Stats Section (e.g. GTH stats, Global Edge awards) */}
      {data.stats && <EdgeStats section={data.stats} />}

      {/* 5. Mentors Section (e.g. GFS 10 Mentors, GTH Mentors) */}
      {data.mentors && <EdgeMentors section={data.mentors} />}

      {/* 6. Feature Sections (e.g. NEP 10 Advantages, Vocational Courses, GTH Offerings) */}
      {data.features &&
        data.features.map((featureSection) => (
          <EdgeFeatureGrid key={featureSection.id} section={featureSection} />
        ))}

      {/* 7. Accordion Sections (e.g. Law programs) */}
      {data.accordions &&
        data.accordions.map((accSection) => (
          <EdgeAccordion key={accSection.id} section={accSection} />
        ))}

      {/* 8. Video Spotlights / Playlists (e.g. Voices from the Hub, Vocational Masterclass) */}
      {data.videos && <EdgeVideoSection section={data.videos} />}

      {/* 9. Testimonials (e.g. GFS Student Transformation Stories) */}
      {data.testimonials && <EdgeTestimonials section={data.testimonials} />}

      {/* 10. Photo Gallery / Highlights */}
      {data.gallery && <EdgeGallery section={data.gallery} />}

      {/* 11. Legacy & Ecosystem Section */}
      <LegacyEcosystem />

      {/* 12. Bottom CTA Section */}
      {data.cta && <EdgeCTA cta={data.cta} />}
    </main>
  );
}
