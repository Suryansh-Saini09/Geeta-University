import React from "react";
import Image from "next/image";
import { Bus, Train, Plane, Clock, ShieldCheck } from "lucide-react";

interface ReachInfographicSectionProps {
  hero?: {
    title?: string;
    subtitle?: string;
    description?: string;
    infographic_image?: string;
    infographic_alt?: string;
  } | null;
}

export default function ReachInfographicSection({ hero }: ReachInfographicSectionProps) {
  const title = hero?.title || "How to Reach Geeta University";
  const subtitle = hero?.subtitle || "Official Route Diagram & Distance Timeline";
  const description = hero?.description;
  const imageSrc = hero?.infographic_image || "/Info-G-of-GU-NEXT-EXPORT.webp";
  const imageAlt = hero?.infographic_alt || "How to Reach Geeta University Transport Diagram Map";

  return (
    <section className="w-full bg-[#F7F9FC] py-12 md:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

        {(title || subtitle || description) && (
          <div className="mx-auto max-w-3xl text-center">
            {title && (
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#0A1F44] sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-3 text-lg font-semibold text-[#E8871A]">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="mt-2 text-base text-slate-600">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Official Route Diagram Card */}
        <div className="relative mx-auto max-w-5xl rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] max-h-[550px] flex items-center justify-center rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain p-2 sm:p-4 hover:scale-[1.01] transition-transform duration-300"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
