
import React from "react";
import Image from "next/image";
import type { CourseHero as CourseHeroType } from "@/data/programs/courses/types";

interface CourseHeroProps {
  hero: CourseHeroType;
  schoolName?: string;
  schoolSlug?: string;
}

export default function CourseHero({ hero }: CourseHeroProps) {
  const hasMobileImage = Boolean(hero.mobileImage);

  return (
    <section id="Overview" className="relative w-full overflow-hidden bg-[#050F24]">
      {/* Strict 16:9 Aspect Ratio Container - Exactly matches the 16:9 dimensions of the school hero banners */}
      <div className="relative w-full aspect-[16/9]">
        {hasMobileImage ? (
          <>
            {/* Desktop Banner Image */}
            <div className="hidden md:block absolute inset-0 w-full h-full">
              <Image
                src={hero.image}
                alt={hero.title || "Course Hero Banner"}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>

            {/* Mobile Banner Image */}
            <div className="block md:hidden absolute inset-0 w-full h-full">
              <Image
                src={hero.mobileImage!}
                alt={hero.title || "Course Hero Banner"}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={hero.image}
              alt={hero.title || "Course Hero Banner"}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        )}
      </div>
    </section>
  );
}
