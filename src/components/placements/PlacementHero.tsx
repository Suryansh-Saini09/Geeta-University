"use client";

import React from "react";

export default function PlacementHero({ data }: { data?: any }) {
  const heroImage = data?.heroImage || data?.image || "/placements/placement-banner.jpg";
  const title = data?.title || "Geeta University Campus Placements";

  return (
    <section className="w-full bg-[#002E5B] border-b border-slate-200">
      {/* Crisp, Full-Width Top Banner Image (100% visible, no cutoff) */}
      <img
        src={heroImage}
        alt={title}
        className="w-full h-auto block"
      />
    </section>
  );
}
