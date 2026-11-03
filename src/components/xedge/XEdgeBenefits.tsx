
import React from "react";
import { TrendingUp, MessageSquareText, SmilePlus } from "lucide-react";

export default function XEdgeBenefits() {
  const benefits = [
    {
      title: "Advancing Career Prospects",
      desc: "Most worthwhile jobs have a 'people component' and the most lucrative positions often involve a large amount of time spent interacting with employees, media, and colleagues. It is rare that an individual can remain isolated in their office and still excel in their job. Most organisations are looking for individuals with a tactical skill set: the ability to work well in a team and to influence and motivate people to get things done.",
      icon: <TrendingUp size={24} className="text-[#23518D]" />,
      badge: "Career Growth",
    },
    {
      title: "Better Communication",
      desc: "Relating with people and being able to work in large groups naturally develops one's communication skills. After all, you cannot have great social skills without good communication skills, and being able to convey one's thoughts and ideas may be the single most important skill that you can develop in life.",
      icon: <MessageSquareText size={24} className="text-[#23518D]" />,
      badge: "Expression",
    },
    {
      title: "Increased Overall Happiness",
      desc: "Getting along and understanding people will help to open many personal and career-related doors. Having the confidence to start a conversation at a work-related conference may lead to a new job offer with a higher salary. A smile and 'hello' in a social situation may lead to a friendship being formed.",
      icon: <SmilePlus size={24} className="text-[#23518D]" />,
      badge: "Well-Being",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24 border-b border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#23518D]" />
            <span className="text-[11px] font-bold uppercase tracking-[3px] text-[#23518D]">
              Strategic Advantages
            </span>
            <span className="h-px w-9 bg-[#23518D]" />
          </div>

          <h2 className="font-serif text-[32px] sm:text-[42px] font-black text-[#0A1F44] leading-tight">
            Impact That Reshapes Your Future
          </h2>
          <p className="mt-3 text-[16px] sm:text-[17px] text-[#64748B]">
            How mastering interpersonal and social intelligence accelerates professional and life success.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((card, idx) => (
            <div
              key={idx}
              className="rounded-[24px] bg-white p-8 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#23518D]/10">
                    {card.icon}
                  </div>
                  <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-serif text-[22px] font-bold text-[#23518D] mb-4">
                  {card.title}
                </h3>

                <p className="text-[15px] leading-[1.8] text-[#475569] text-justify">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
