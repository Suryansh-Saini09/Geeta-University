import React from "react";
import { Building2, MapPin } from "lucide-react";
import { admissionOfficesList as fallbackOffices } from "@/data/contactUsData";

interface ContactOfficesGridProps {
  title?: string;
  offices?: Array<{
    id: string;
    city: string;
    address: string;
    landmark?: string;
  }> | null;
}

export default function ContactOfficesGrid({ title, offices }: ContactOfficesGridProps) {
  const sectionTitle = title || "Our Regional Admission Offices";
  const list = offices && offices.length > 0 ? offices : fallbackOffices;

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#0A1F44] sm:text-4xl">
            {sectionTitle}
          </h2>
        </div>

        {/* Offices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {list.map((office) => (
            <div
              key={office.id || office.city}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#F7F9FC] p-6 transition-all duration-300 hover:border-[#E8871A]/50 hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A1F44] text-[#E8871A] group-hover:bg-[#E8871A] group-hover:text-white transition-colors">
                    <Building2 className="h-5 w-5" />
                  </div>
                  {office.landmark && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-[#E8871A]">
                      {office.landmark}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#0A1F44] mb-2">
                  {office.city}
                </h3>

                <div className="flex items-start gap-2 text-xs text-slate-600 font-sans leading-relaxed">
                  <MapPin className="h-4 w-4 text-[#E8871A] shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
