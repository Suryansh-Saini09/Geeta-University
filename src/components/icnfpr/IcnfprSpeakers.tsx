
import React from "react";
import Image from "next/image";
import { Mic, Award, MapPin } from "lucide-react";
import { keynoteSpeakers, guestsOfHonour } from "@/data/icnfprData";

export default function IcnfprSpeakers() {
  return (
    <section id="speakers" className="py-20 lg:py-24 bg-[#F8FAFC] text-[#0A1F44] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Keynote & Invited Speakers */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-3 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
            <Mic size={16} />
            <span>Global Thought Leaders</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1F44] tracking-tight">
            Keynote &amp; Invited <span className="text-[#E8871A]">Speakers</span>
          </h2>
          <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
            Distinguished academicians and researchers sharing pioneering insights on Pharma 5.0, AI, and advanced therapeutics.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 justify-center">
          {keynoteSpeakers.map((speaker, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(10,31,68,0.04)] hover:shadow-xl hover:border-[#E8871A]/40 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-5 border-4 border-slate-100 group-hover:border-[#E8871A] transition-colors shadow-sm">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  sizes="128px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="font-serif text-[17px] font-bold text-[#0A1F44] mb-2 leading-tight group-hover:text-[#E8871A] transition-colors">
                {speaker.name}
              </h3>

              <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed line-clamp-4 mb-4 flex-1">
                {speaker.role}
              </p>

              {speaker.location && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#0A1F44] text-xs font-semibold border border-slate-200">
                  <MapPin size={12} className="text-[#E8871A]" />
                  <span>{speaker.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section 2: Guest of Honour */}
        <div className="mt-24 pt-14 border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-3 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
              <Award size={16} />
              <span>Dignitaries &amp; Leadership</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-black text-[#0A1F44] tracking-tight">
              Guests of <span className="text-[#E8871A]">Honour</span>
            </h3>
            <p className="mt-2 text-[#475569] text-sm sm:text-base">
              Esteemed leadership from the Indian Pharmacist Association (IPA) Haryana Branch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {guestsOfHonour.map((guest, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 text-center flex flex-col items-center shadow-sm hover:shadow-md hover:border-[#E8871A]/40 transition-all"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-slate-200 shadow-sm">
                  <Image
                    src={guest.image}
                    alt={guest.name}
                    fill
                    sizes="96px"
                    className="object-cover object-center"
                  />
                </div>
                <h4 className="font-serif text-[15px] font-bold text-[#0A1F44] mb-1">
                  {guest.name}
                </h4>
                <p className="text-xs text-[#E8871A] font-bold">
                  {guest.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
