import React from "react";
import { googleMapEmbedUrl as fallbackMapUrl } from "@/data/contactUsData";

interface ContactMapSectionProps {
  map?: {
    title?: string;
    subtitle?: string;
    mapEmbedUrl?: string;
  } | null;
}

export default function ContactMapSection({ map }: ContactMapSectionProps) {
  const title = map?.title || "Find Us on Google Maps";
  const subtitle =
    map?.subtitle || "NH-71, Naultha, Panipat, Haryana 132145 (Gohana Road)";
  const embedUrl = map?.mapEmbedUrl || fallbackMapUrl;

  return (
    <section id="google-map" className="w-full bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#0A1F44] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-base text-slate-600 font-sans">
            {subtitle}
          </p>
        </div>

        {/* Map Container */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-100">
          <iframe
            src={embedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Geeta University Main Campus Map Location"
            className="w-full h-[400px] sm:h-[480px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
