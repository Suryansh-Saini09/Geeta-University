
import React from "react";
import {
  Briefcase,
  Compass,
  CheckCircle2,
  Heart,
  Brain,
  MessageSquare,
  Sparkles,
  Users2,
  TrendingUp,
  Quote,
} from "lucide-react";

export default function XEdgeCategories() {
  const careerSkillsList = [
    {
      title: "Planning your career",
      desc: "to ensure that you achieve your dreams.",
    },
    {
      title: "Self-awareness",
      desc: "to recognize the strengths and opportunities you need to work on and to gain a better understanding about your reaction to others, especially when you are stressed.",
    },
    {
      title: "Networking",
      desc: "build a unique collection of contacts that act as your source of information, ideas, and professional leads.",
    },
    {
      title: "Working with mentors",
      desc: "to learn and bounce ideas and what might turn out to be not-so-crazy schemes you have.",
    },
    {
      title: "Knowing how to recognize when it's time to move on",
      desc: "develop the xedge skills so you can act when the time is right.",
    },
    {
      title: "Get the job you want",
      desc: "skills to make sure you're the one recruiters pick.",
    },
    {
      title: "Earn your worth",
      desc: "know how and when to negotiate for yourself.",
    },
  ];

  const lifeSkillsList = [
    {
      title: "Communication and interpersonal skills",
      desc: "They broadly describe the skills needed to get along and work with other people. These skills are essential for sending and receiving messages, either verbally or in writing.",
    },
    {
      title: "Decision-making and problem-solving",
      desc: "They describe the skills required to understand problems, find their solutions, alone or with others, and then take appropriate action to address them.",
    },
    {
      title: "Creative thinking and critical thinking",
      desc: "They describe the ability to perceive problems in different and unusual ways and find new solutions or generate new ideas. They also include the ability to evaluate information carefully and understand its relevance.",
    },
    {
      title: "Self-awareness and empathy",
      desc: "They are the two key aspects of emotional intelligence and describe understanding yourself and being able to feel for other people as if their experiences were happening to you.",
    },
    {
      title: "Assertiveness and equanimity, or self-control",
      desc: "They describe the skills needed to stand up for yourself and other people and stay calm even in the face of considerable provocation.",
    },
    {
      title: "Resilience and ability to cope with problems",
      desc: "They describe the ability to recover from setbacks and treat them as opportunities or simply experiences that help us learn and improve.",
    },
  ];

  return (
    <div id="categories" className="scroll-mt-24 w-full">
      {/* ── Category 1 & 2: Career Skills & Life Skills (Light Background with Crisp Cards) ── */}
      <section className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24 border-b border-[#E2E8F0]">
        <div className="gu-container">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-9 bg-[#E8871A]" />
              <span className="text-[11px] font-bold uppercase tracking-[3px] text-[#E8871A]">
                Skill Architecture
              </span>
              <span className="h-px w-9 bg-[#E8871A]" />
            </div>

            <h2 className="font-serif text-[32px] sm:text-[42px] font-black text-[#0A1F44] leading-tight">
              These Fall Into 3 Broad Categories
            </h2>
            <p className="mt-3 text-[16px] sm:text-[18px] text-[#64748B]">
              A balanced three-dimensional learning framework designed for total personal &amp; professional mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Category 1: Career Skills */}
            <div
              id="career-skills"
              className="scroll-mt-28 rounded-[24px] bg-white text-[#1A1A2E] p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-[#E2E8F0]"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8871A]/10 text-[#E8871A]">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E8871A]">
                      Category 1
                    </span>
                    <h3 className="font-serif text-[26px] sm:text-[30px] font-black text-[#0A1F44]">
                      Career Skills
                    </h3>
                  </div>
                </div>

                <p className="text-[15.5px] leading-[1.8] text-[#475569] mb-6 text-justify">
                  At Geeta University, our professionally competent teachers nurture your Xedge skills that will not only help you manage your career in the long run, but will prove beneficial for you today as well. It is human nature to evolve transform and develop. Working to build your future now will put you in the best position to get what you want, besides boosting your confidence about the actions you are taking and the choices you are making today. These skills will also help you to perform better in your current job creating a win-win situation for you.
                </p>

                <div className="rounded-xl bg-[#FFF8F0] border border-[#E8871A]/20 p-4 mb-6">
                  <p className="text-[15px] font-bold text-[#0A1F44]">
                    The Xedge skills to develop and manage your career include:
                  </p>
                </div>

                <ul className="space-y-4">
                  {careerSkillsList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#334155]">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8871A]/15 text-[#E8871A]">
                        <CheckCircle2 size={14} className="text-[#E8871A]" />
                      </span>
                      <span>
                        <strong className="font-bold text-[#0A1F44]">{item.title} — </strong>
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Category 2: Life Skills */}
            <div
              id="life-skills"
              className="scroll-mt-28 rounded-[24px] bg-white text-[#1A1A2E] p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-[#E2E8F0]"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0284C7]/10 text-[#0284C7]">
                    <Heart size={24} />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0284C7]">
                      Category 2
                    </span>
                    <h3 className="font-serif text-[26px] sm:text-[30px] font-black text-[#0A1F44]">
                      Life Skills
                    </h3>
                  </div>
                </div>

                <p className="text-[15.5px] leading-[1.8] text-[#475569] mb-4 text-justify">
                  Life Skills refer to the skills you need to make the most out of life. Broadly speaking, the term &apos;life skills&apos; is generally used for any skill needed to handle the challenges of life most efficiently. At Geeta University, we not only improve your professional skills but also work to enhance your personal growth. We provide you with a platform where you can follow your passion and practice personal skills.
                </p>

                <p className="text-[15.5px] leading-[1.8] text-[#475569] mb-6 text-justify">
                  So, it is clear that all individuals have some potential thanks to their unique skill sets. It is important to nurture and enhance the skills that are critical to their progress, while letting go of those that hinder their growth. For instance, the ability to connect with people easily, is a vital skill for someone intending to lead a public life. However, being excessively vocal about anything and everything is something that such individuals need to let go of.
                </p>

                <div className="rounded-xl bg-[#F0F7FD] border border-[#0284C7]/20 p-4 mb-6">
                  <p className="text-[15px] font-bold text-[#0A1F44]">
                    Skills we help you develop:
                  </p>
                </div>

                <ul className="space-y-4">
                  {lifeSkillsList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#334155]">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0284C7]/15 text-[#0284C7]">
                        <CheckCircle2 size={14} className="text-[#0284C7]" />
                      </span>
                      <span>
                        <strong className="font-bold text-[#0A1F44]">{item.title}. </strong>
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category 3: Social Skills (Clean, Light, Elegant Theme) ── */}
      <section
        id="social-skills"
        className="scroll-mt-24 bg-white text-[#1A1A2E] py-16 sm:py-20 lg:py-24 border-b border-[#E2E8F0]"
      >
        <div className="gu-container">
          <div className="max-w-4xl mx-auto">

            <h2 className="font-serif text-[32px] sm:text-[42px] font-black text-[#0A1F44] leading-tight mb-6">
              Social Skills
            </h2>

            <div className="space-y-6 text-[16px] sm:text-[17.5px] leading-[1.85] text-[#475569] text-justify">
              <p>
                Our personality development team helps you to improve your Social skills. The skills we use to communicate and interact with each other, both verbally and non-verbally, through gestures, body language, and our personal appearance. Human beings are social creatures and we have developed many ways to communicate our messages, thoughts, and feelings with others.
              </p>

              <p>
                What is said is influenced by both verbal language and the way we use it - tone of voice, the volume of speech, and the words we choose - as well as by more subtle messages such as body language, gestures, and other non-verbal communication methods.
              </p>

              <p>
                The fact that some people are better in &apos;social interactions&apos; than others has led to detailed investigations into the nature and function of interpersonal interaction.
              </p>

              <div className="rounded-2xl bg-[#FFFBEB] border-l-4 border-[#E8871A] p-6 sm:p-7 shadow-sm text-[#0A1F44]">
                <p className="font-bold text-[17px] sm:text-[18px] leading-relaxed text-[#0A1F44]">
                  Developing social skills is about being aware of how we communicate with others,{" "}
                  <span className="font-normal text-[#475569]">
                    the messages we send and how methods of communication can be improved to make the way we communicate more efficient and effective.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
