"use client";

import React from "react";
import Link from "next/link";
import { Info, Phone, Mail, ArrowRight } from "lucide-react";

export interface PhdNoticeAndContactProps {
  data?: {
    title?: string;
    noticeText?: string;
    officeHours?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
}

export default function PhdNoticeAndContact({ data }: PhdNoticeAndContactProps = {}) {
  const phone = data?.contactPhone || "+91 9996748478";
  const email = data?.contactEmail || "phdcell@geetauniversity.edu.in";
  const hours = data?.officeHours || "Monday – Saturday, 9:00 AM to 5:00 PM IST";

  return (
    <section className="w-full bg-[#F8FAFC] py-14 sm:py-18 border-b border-[#E2E8F0]">
      <div className="gu-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Important Notice */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-[22px] border-l-[6px] border-l-[#FF5F19] border border-[#E2E8F0] bg-[#FFF8F0] p-6 sm:p-8 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Info className="h-6 w-6 text-[#FF5F19]" />
                <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0E385D]">
                  {data?.title || "Important Notice"}
                </h3>
              </div>
              <p className="text-[15.5px] leading-relaxed text-[#555] mb-4">
                {data?.noticeText ||
                  "Applicants and candidates are requested to regularly check Geeta University’s official website for all updates regarding amendments to the doctoral advertisement, shortlist information, exam centers, and important dates for the written entrance test:"}
              </p>
            </div>

            <div>
              <Link
                href="/phd"
                className="inline-flex items-center gap-2 text-[15px] font-bold text-[#FF5F19] hover:underline"
              >
                <span>https://geetauniversity.edu.in/phd</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: Contact Card */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-[22px] border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F1F5F9]">
                <Phone className="h-5 w-5 text-[#0E385D]" />
                <h3 className="font-serif text-[22px] font-bold text-[#0E385D]">
                  University Ph.D. Cell
                </h3>
              </div>

              <div className="mb-4">
                <div className="text-[17px] font-bold text-[#0A1F44]">Dr. Sangeeta Chaudhary</div>
                <div className="text-[13.5px] font-medium text-[#64748B]">Head: University Ph.D. Cell</div>
              </div>

              <div className="space-y-2.5 text-[15px]">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#64748B] shrink-0" />
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="font-semibold text-[#0A1F44] hover:text-[#E8871A] transition-colors">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#64748B] shrink-0" />
                  <a href={`mailto:${email}`} className="font-semibold text-[#0A1F44] hover:text-[#E8871A] transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-xs text-[#94A3B8]">
              Office Hours: {hours}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
