
import React from "react";
import Image from "next/image";

export default function PlacementHero({ data }: { data?: any }) {
  const heroImage = data?.heroImage || data?.image || "/placements/placement-banner.jpg";
  const title = data?.title || "Geeta University Campus Placements";

  return (
    <section className="w-full bg-[#002E5B] border-b border-slate-200">
      {/* Crisp, Full-Width Top Banner Image (100% visible, no cutoff) */}
      <Image
        src={heroImage}
        alt={title}
        width={1600}
        height={900}
        sizes="100vw"
        preload
        className="w-full h-auto block"
      />
    </section>
  );
}
