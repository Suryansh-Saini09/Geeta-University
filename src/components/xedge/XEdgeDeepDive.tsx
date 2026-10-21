"use client";

import React from "react";
import Image from "next/image";
import { Users, Zap, HeartHandshake, Smile } from "lucide-react";

export default function XEdgeDeepDive() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-[#E2E8F0]">
      <div className="gu-container space-y-16 lg:space-y-24">
        {/* Pair 1: More and Better Relationships */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-[#E2E8F0] shadow-lg shadow-black/5">
              <Image
                src="/uploads/all/508/conversions/college-girl-working-with-laptop-after-lessons-1024x683-1-full.webp"
                alt="More and Better Relationships - Geeta University XEdge"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#23518D]/10 px-3.5 py-1 text-[12px] font-bold text-[#23518D] uppercase tracking-wider">
              <HeartHandshake size={14} />
              Interpersonal Connections
            </div>

            <h3 className="font-serif text-[28px] sm:text-[34px] md:text-[38px] font-black text-[#23518D] leading-tight">
              More and Better Relationships
            </h3>

            <p className="text-[16px] sm:text-[17px] leading-[1.85] text-[#334155] text-justify">
              Identifying well with individuals leads to better relationships and, at times,
              friendships. By developing your social skills you become more{" "}
              <strong className="text-[#0A1F44] font-bold">charismatic</strong>, which is a desirable
              trait. People are more interested in charismatic people as non-charismatic people are
              (or at least appear to be) more influenced by them. Most people know you cannot advance
              far in life without strong interpersonal relationships.
            </p>

            <p className="text-[16px] sm:text-[17px] leading-[1.85] text-[#334155] text-justify">
              Focusing on relationships will help you get a job, get promoted and make new friends.
              Well honed social skills can increase your happiness and satisfaction and give you a
              better outlook on life. Better relationships can also help to reduce the negative
              effects of <strong className="text-[#0A1F44] font-bold">stress</strong> and boost
              your <strong className="text-[#0A1F44] font-bold">self-esteem</strong>.
            </p>
          </div>
        </div>

        {/* Pair 2: Greater Efficiency (Reversed for Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content (Order 2 on desktop so image is on right) */}
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#23518D]/10 px-3.5 py-1 text-[12px] font-bold text-[#23518D] uppercase tracking-wider">
              <Zap size={14} />
              Strategic Social Mastery
            </div>

            <h3 className="font-serif text-[28px] sm:text-[34px] md:text-[38px] font-black text-[#23518D] leading-tight">
              Greater Efficiency
            </h3>

            <p className="text-[16px] sm:text-[17px] leading-[1.85] text-[#334155] text-justify">
              If you are good with people, you can more easily avoid being with the people you do
              not like as much as others. Some people dread social interactions because they do not
              wish to spend time with individuals who do not have similar interests and viewpoints.
              It is a lot easier to attend a meeting at work or a party in your personal life if you
              know at least some of the people who will be there.
            </p>

            <p className="text-[16px] sm:text-[17px] leading-[1.85] text-[#334155] text-justify">
              If you are in a social situation and do not want to spend time with &apos;John&apos; because you
              don&apos;t like him or he cannot help you with a particular issue, a good set of social
              skills will allow you to politely convey that you need to spend time with other people
              at the get together.
            </p>
          </div>

          {/* Image */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-[#E2E8F0] shadow-lg shadow-black/5">
              <Image
                src="/uploads/all/514/conversions/pexels-andrea-piacquadio-3762800-full.webp"
                alt="Greater Efficiency - Geeta University XEdge"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
