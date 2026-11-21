
import React from "react";
import type { EdgePageData } from "@/data/edge/types";
import EdgeHero from "./EdgeHero";
import EdgeTimeline from "./EdgeTimeline";
import EdgeTrainingModel from "./EdgeTrainingModel";
import EdgeStats from "./EdgeStats";
import EdgeHeadProfile from "./EdgeHeadProfile";
import EdgeFeatureGrid from "./EdgeFeatureGrid";
import EdgeMentors from "./EdgeMentors";
import EdgeVideoSection from "./EdgeVideoSection";
import EdgeAccordion from "./EdgeAccordion";
import EdgeTestimonials from "./EdgeTestimonials";
import EdgeGallery from "./EdgeGallery";
import EdgeHackathons from "./EdgeHackathons";
import EdgeCTA from "./EdgeCTA";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

interface EdgePageProps {
  data: EdgePageData;
}

export default function EdgePage({ data }: EdgePageProps) {
  const headProfile = data.headProfile || data.mentors?.headProfile;

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

      {/* 5. Head Profile Card (e.g. GTH COO Leadership) */}
      {headProfile && <EdgeHeadProfile profile={headProfile} />}

      {/* 6. Mentors Section (e.g. GFS Mentors, GTH Mentors) */}
      {data.mentors && <EdgeMentors section={data.mentors} />}

      {/* 7. Feature Sections (e.g. NEP 10 Advantages, Vocational Courses, GTH Offerings) */}
      {data.features &&
        data.features.map((featureSection) => (
          <EdgeFeatureGrid key={featureSection.id} section={featureSection} />
        ))}

      {/* 8. Accordion Sections (e.g. Law programs) */}
      {data.accordions &&
        data.accordions.map((accSection) => (
          <EdgeAccordion key={accSection.id} section={accSection} />
        ))}

      {/* 9. Video Spotlights / Playlists (e.g. Voices from the Hub, Vocational Masterclass) */}
      {data.videos && <EdgeVideoSection section={data.videos} />}

      {/* 10. Testimonials (e.g. GFS Student Transformation Stories) */}
      {data.testimonials && <EdgeTestimonials section={data.testimonials} />}

      {/* 11. Photo Gallery / Highlights */}
      {data.gallery && <EdgeGallery section={data.gallery} />}

      {/* 12. Hackathons Section (e.g. HackForge, NexHack) */}
      {data.hackathons && <EdgeHackathons section={data.hackathons} />}

      {/* 13. Legacy & Ecosystem Section */}
      <LegacyEcosystem />

      {/* 14. Bottom CTA Section */}
      {data.cta && <EdgeCTA cta={data.cta} />}
    </main>
  );
}
