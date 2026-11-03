
import React from "react";
import { CheckCircle2, Target, Award, Users } from "lucide-react";

export default function XEdgeOverview() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-12 sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8871A]" />
            <span className="text-[11px] font-bold uppercase tracking-[3px] text-[#E8871A]">
              Corporate Citizen Initiative
            </span>
            <span className="h-px w-9 bg-[#E8871A]" />
          </div>

          <h2 className="font-serif text-[32px] sm:text-[42px] md:text-[48px] font-black text-[#0A1F44] leading-[1.15] tracking-tight">
            Developing Complete <span className="text-[#E8871A]">Corporate Citizens</span>
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#64748B] max-w-2xl mx-auto">
            Empowering students with industry-relevant skills, professional maturity, and the confidence to lead.
          </p>
        </div>

        {/* Narrative Content with High Readability */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Story Text */}
          <div className="lg:col-span-8 space-y-6 text-[16px] sm:text-[17.5px] leading-[1.85] text-[#334155] text-justify">
            <p className="first-letter:font-serif first-letter:text-[42px] first-letter:font-black first-letter:text-[#0A1F44] first-letter:mr-2 first-letter:float-left first-letter:leading-none">
              Geeta University has taken up a new initiative towards developing{" "}
              <strong className="text-[#0A1F44] font-bold">Complete Corporate Citizens</strong>.
              In this, we help our students master various high-quality skills to enlighten their
              path. We have a dedicated and experienced professional team to groom the students for
              the same. This ensures that the students not only gain professional skills but also
              evolve into highly motivated individuals.
            </p>

            <p>
              Students passing out from Geeta University are a complete package in themselves. They
              have proven to be valuable entities and assets for their organizations and their
              country from day one. They are prepared, full of purpose, and eager to overcome any
              challenges without losing their mind or patience. They are quite mature and possess the
              cutting-edge skills necessary to endure the arduous ethics and dedication required for
              success.
            </p>

            <p>
              We help you develop the traits that enable you to do your job properly and manage your
              career successfully. These in-demand skills and technical knowledge enhance your
              competence and make you invaluable to your employers.
            </p>
          </div>

          {/* Key Value Cards */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="rounded-[18px] bg-[#F8FAFC] border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8871A]/10 text-[#E8871A]">
                  <Target size={20} />
                </div>
                <h3 className="font-serif text-[18px] font-bold text-[#0A1F44]">
                  Day-One Ready
                </h3>
              </div>
              <p className="text-[14px] leading-relaxed text-[#64748B]">
                Graduates possess the practical competence and ethical fortitude required to contribute immediately in high-stakes corporate environments.
              </p>
            </div>

            <div className="rounded-[18px] bg-[#F8FAFC] border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A1F44]/10 text-[#0A1F44]">
                  <Users size={20} />
                </div>
                <h3 className="font-serif text-[18px] font-bold text-[#0A1F44]">
                  Holistic Grooming
                </h3>
              </div>
              <p className="text-[14px] leading-relaxed text-[#64748B]">
                Guided by expert corporate trainers, psychometric experts, and senior mentors across academia and industry.
              </p>
            </div>

            <div className="rounded-[18px] bg-[#F8FAFC] border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#059669]/10 text-[#059669]">
                  <Award size={20} />
                </div>
                <h3 className="font-serif text-[18px] font-bold text-[#0A1F44]">
                  Long-Term Invaluable Value
                </h3>
              </div>
              <p className="text-[14px] leading-relaxed text-[#64748B]">
                Traits that empower continuous learning, proactive career self-management, negotiation prowess, and emotional intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
