"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Heart,
  Users,
  Compass,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  MessageSquareText,
  SmilePlus,
  ArrowRight,
  ShieldCheck,
  Quote,
} from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

import type { EdgePageData } from "@/data/edge/types";

export default function XEdgePage({ pageData }: { pageData?: EdgePageData }) {
  const heroImage = pageData?.hero?.image || "https://geetauniversity.edu.in/uploads/all/120/conversions/2-xedge-full.webp";

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#1A1A2E]">
      {/* ── 1. Hero Section (Hero image preserved) ── */}
      <section className="relative w-full bg-[#0A1F44] overflow-hidden">
        {/* Full-width responsive banner image with ample vertical presence */}
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[560px]">
          <Image
            src={heroImage}
            alt="XEDGE - Geeta University"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Title Header Strip */}
        <div className="bg-[#081B3A] border-t border-white/10 py-5">
          <div className="gu-container flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-serif text-[32px] sm:text-[40px] font-black text-white tracking-tight m-0">
              X<span className="text-[#E8871A]">EDGE</span>
            </h1>

            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#94A3B8]">
              <Link href="/" className="hover:text-[#E8871A] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-white">XEDGE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Introduction Section (Refined Executive Editorial Card) ── */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="gu-container max-w-5xl">
          <div className="rounded-[28px] bg-white border border-[#E2E8F0] p-8 sm:p-12 lg:p-14 shadow-sm relative overflow-hidden">
            {/* Subtle corner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8871A]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-6 flex items-center gap-3">
              <span className="h-0.5 w-10 bg-[#E8871A]" />
            </div>

            <div className="space-y-6 text-[17px] sm:text-[18px] leading-[1.9] text-[#334155] text-justify">
              <p className="first-letter:font-serif first-letter:text-[48px] first-letter:font-black first-letter:text-[#0A1F44] first-letter:mr-2.5 first-letter:float-left first-letter:leading-none">
                Geeta University has taken up a new initiative towards developing{" "}
                <strong className="text-[#0A1F44] font-bold">Complete Corporate Citizens</strong>. In
                this, we help our students master various high-quality skills to enlighten their
                path. We have a dedicated and experienced professional team to groom the students
                for the same. This ensures that the students not only gain professional skills but
                also evolve into highly motivated individuals.
              </p>

              <p>
                Students passing out from Geeta University are a complete package in themselves.
                They have proven to be valuable entities and assets for their organizations and
                their country from day one. They are prepared, full of purpose, and eager to overcome
                any challenges without losing their mind or patience. They are quite mature and
                possess the cutting-edge skills necessary to endure the arduous ethics and dedication
                required for success.
              </p>

              <p>
                We help you develop the traits that enable you to do your job properly and manage
                your career successfully. These in-demand skills and technical knowledge enhance your
                competence and make you invaluable to your employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. These Fall Into 3 Broad Categories (Modern Clean Cards) ── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-b border-[#E2E8F0]">
        <div className="gu-container">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center mb-14 sm:mb-18">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-9 bg-[#E8871A]" />
              <span className="h-px w-9 bg-[#E8871A]" />
            </div>

            <h2 className="font-serif text-[32px] sm:text-[42px] font-black text-[#0A1F44] leading-tight">
              These Fall Into 3 Broad Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Category 1: Career Skills */}
            <div
              id="career-skills"
              className="scroll-mt-28 rounded-[28px] bg-[#F8FAFC] border border-[#E2E8F0] p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-6">
                  <div>
                    <h3 className="font-serif text-[26px] sm:text-[30px] font-black text-[#0A1F44]">
                      Career Skills
                    </h3>
                  </div>
                </div>

                <p className="text-[15.5px] leading-[1.85] text-[#475569] mb-6 text-justify">
                  At Geeta University, our professionally competent teachers nurture your Xedge
                  skills that will not only help you manage your career in the long run, but will
                  prove beneficial for you today as well. It is human nature to evolve transform
                  and develop. Working to build your future now will put you in the best position to
                  get what you want, besides boosting your confidence about the actions you are
                  taking and the choices you are making today. These skills will also help you to
                  perform better in your current job creating a win-win situation for you.
                </p>

                <div className="rounded-2xl bg-white border border-[#E8871A]/20 p-4 sm:p-5 mb-6 shadow-sm">
                  <p className="text-[15px] font-bold text-[#0A1F44] m-0">
                    The Xedge skills to develop and manage your career include:
                  </p>
                </div>

                <ul className="space-y-4 text-[15px] leading-relaxed text-[#334155] list-none p-0 m-0 text-justify">
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8871A]/15 text-[#E8871A]">
                      <CheckCircle2 size={14} className="text-[#E8871A]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">Planning your career —</strong>{" "}
                      to ensure that you achieve your dreams.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8871A]/15 text-[#E8871A]">
                      <CheckCircle2 size={14} className="text-[#E8871A]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">Self-awareness —</strong> to
                      recognize the strengths and opportunities you need to work on and to gain a
                      better understanding about your reaction to others, especially when you are
                      stressed.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8871A]/15 text-[#E8871A]">
                      <CheckCircle2 size={14} className="text-[#E8871A]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">Networking —</strong> build a
                      unique collection of contacts that act as your source of information, ideas,
                      and professional leads.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8871A]/15 text-[#E8871A]">
                      <CheckCircle2 size={14} className="text-[#E8871A]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">Working with mentors —</strong>{" "}
                      to learn and bounce ideas and what might turn out to be not-so-crazy schemes you
                      have
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8871A]/15 text-[#E8871A]">
                      <CheckCircle2 size={14} className="text-[#E8871A]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">
                        Knowing how to recognize when it&apos;s time to move on —
                      </strong>{" "}
                      develop the xedge skills so you can act when the time is right.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8871A]/15 text-[#E8871A]">
                      <CheckCircle2 size={14} className="text-[#E8871A]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">Get the job you want —</strong>{" "}
                      skills to make sure you&apos;re the one recruiters pick.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8871A]/15 text-[#E8871A]">
                      <CheckCircle2 size={14} className="text-[#E8871A]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">Earn your worth —</strong> know
                      how and when to negotiate for yourself.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Category 2: Life Skills */}
            <div
              id="life-skills"
              className="scroll-mt-28 rounded-[28px] bg-[#F8FAFC] border border-[#E2E8F0] p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-6">
                  <div>
                    <h3 className="font-serif text-[26px] sm:text-[30px] font-black text-[#0A1F44]">
                      Life Skills
                    </h3>
                  </div>
                </div>

                <p className="text-[15.5px] leading-[1.85] text-[#475569] mb-4 text-justify">
                  Life Skills refer to the skills you need to make the most out of life. Broadly
                  speaking, the term &apos;life skills&apos; is generally used for any skill needed to
                  handle the challenges of life most efficiently. At Geeta University, we not only
                  improve your professional skills but also work to enhance your personal growth. We
                  provide you with a platform where you can follow your passion and practice
                  personal skills.
                </p>

                <p className="text-[15.5px] leading-[1.85] text-[#475569] mb-6 text-justify">
                  So, it is clear that all individuals have some potential thanks to their unique
                  skill sets. It is important to nurture and enhance the skills that are critical to
                  their progress, while letting go of those that hinder their growth. For instance,
                  the ability to connect with people easily, is a vital skill for someone intending to
                  lead a public life. However, being excessively vocal about anything and everything
                  is something that such individuals need to let go of.
                </p>

                <div className="rounded-2xl bg-white border border-[#0284C7]/20 p-4 sm:p-5 mb-6 shadow-sm">
                  <p className="text-[15px] font-bold text-[#0A1F44] m-0">
                    Skills we help you develop:
                  </p>
                </div>

                <ul className="space-y-4 text-[15px] leading-relaxed text-[#334155] list-none p-0 m-0 text-justify">
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0284C7]/15 text-[#0284C7]">
                      <CheckCircle2 size={14} className="text-[#0284C7]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">
                        Communication and interpersonal skills.
                      </strong>{" "}
                      They broadly describe the skills needed to get along and work with other people.
                      These skills are essential for sending and receiving messages, either verbally
                      or in writing.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0284C7]/15 text-[#0284C7]">
                      <CheckCircle2 size={14} className="text-[#0284C7]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">
                        Decision-making and problem-solving.
                      </strong>{" "}
                      They describe the skills required to understand problems, find their solutions,
                      alone or with others, and then take appropriate action to address them.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0284C7]/15 text-[#0284C7]">
                      <CheckCircle2 size={14} className="text-[#0284C7]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">
                        Creative thinking and critical thinking.
                      </strong>{" "}
                      They describe the ability to perceive problems in different and unusual ways
                      and find new solutions or generate new ideas. They also include the ability to
                      evaluate information carefully and understand its relevance.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0284C7]/15 text-[#0284C7]">
                      <CheckCircle2 size={14} className="text-[#0284C7]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">
                        Self-awareness and empathy.
                      </strong>{" "}
                      They are the two key aspects of emotional intelligence and describe
                      understanding yourself and being able to feel for other people as if their
                      experiences were happening to you.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0284C7]/15 text-[#0284C7]">
                      <CheckCircle2 size={14} className="text-[#0284C7]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">
                        Assertiveness and equanimity, or self-control.
                      </strong>{" "}
                      They describe the skills needed to stand up for yourself and other people and
                      stay calm even in the face of considerable provocation.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#E2E8F0]/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0284C7]/15 text-[#0284C7]">
                      <CheckCircle2 size={14} className="text-[#0284C7]" />
                    </span>
                    <span>
                      <strong className="font-bold text-[#0A1F44]">
                        Resilience and ability to cope with problems.
                      </strong>{" "}
                      They describe the ability to recover from setbacks and treat them as
                      opportunities or simply experiences that help us learn and improve.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Social Skills Section (Executive Light Card) ── */}
      <section id="social" className="py-16 sm:py-20 lg:py-24">
        <div className="gu-container max-w-5xl">
          <div className="rounded-[28px] bg-white border border-[#E2E8F0] p-8 sm:p-12 lg:p-14 shadow-sm">

            <h3 className="font-serif text-[30px] sm:text-[36px] font-black text-[#0A1F44] mb-6">
              Social Skills
            </h3>

            <div className="space-y-5 text-[16.5px] sm:text-[17.5px] leading-[1.85] text-[#334155] text-justify">
              <p>
                Our personality development team helps you to improve your Social skills. The skills
                we use to communicate and interact with each other, both verbally and non-verbally,
                through gestures, body language, and our personal appearance. Human beings are social
                creatures and we have developed many ways to communicate our messages, thoughts, and
                feelings with others.
              </p>

              <p>
                What is said is influenced by both verbal language and the way we use it - tone of
                voice, the volume of speech, and the words we choose - as well as by more subtle
                messages such as body language, gestures, and other non-verbal communication methods.
              </p>

              <p>
                The fact that some people are better in &apos;social interactions&apos; than others has
                led to detailed investigations into the nature and function of interpersonal
                interaction.
              </p>

              <div className="rounded-2xl bg-[#FFFBEB] border-l-4 border-[#E8871A] p-6 sm:p-7 shadow-sm text-[#0A1F44] mt-6">
                <p className="font-bold text-[17px] sm:text-[18px] leading-relaxed text-[#0A1F44] m-0">
                  Developing social skills is about being aware of how we communicate with others,{" "}
                  <span className="font-normal text-[#475569]">
                    the messages we send and how methods of communication can be improved to make the
                    way we communicate more efficient and effective.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Image & Text Pairs: Relationships & Efficiency (50/50 Balanced Showcase) ── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-b border-[#E2E8F0]">
        <div className="gu-container space-y-16 lg:space-y-24">
          {/* Pair 1: More and Better Relationships */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-[#E2E8F0] shadow-md shadow-slate-200/50 bg-slate-50">
                <Image
                  src="https://geetauniversity.edu.in/uploads/all/508/conversions/college-girl-working-with-laptop-after-lessons-1024x683-1-full.webp"
                  alt="More and Better Relationships"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-serif text-[28px] sm:text-[34px] font-black text-[#23518D] leading-tight">
                More and Better Relationships
              </h3>
              <p className="text-[16px] sm:text-[17px] leading-[1.85] text-[#334155] text-justify">
                Identifying well with individuals leads to better relationships and, at times,
                friendships. By developing your social skills you become more{" "}
                <span className="text-[#0A1F44] font-bold">charismatic,</span> which is a desirable
                trait. People are more interested in charismatic people as non-charismatic people are
                (or at least appear to be) more influenced by them. Most people know you cannot advance
                far in life without strong interpersonal relationships. Focusing on relationships will
                help you get a job, get promoted and make new friends. Well honed social skills can
                increase your happiness and satisfaction and give you a better outlook on life. Better
                relationships can also help to reduce the negative effects of{" "}
                <span className="text-[#0A1F44] font-bold">stress</span> and boost your{" "}
                <span className="text-[#0A1F44] font-bold">self-esteem</span>
              </p>
            </div>
          </div>

          {/* Pair 2: Greater Efficiency */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
              <h3 className="font-serif text-[28px] sm:text-[34px] font-black text-[#23518D] leading-tight">
                Greater Efficiency
              </h3>
              <p className="text-[16px] sm:text-[17px] leading-[1.85] text-[#334155] text-justify">
                If you are good with people, you can more easily avoid being with the people you do not
                like as much as others. Some people dread social interactions because they do not wish
                to spend time with individuals who do not have similar interests and viewpoints. It is
                a lot easier to attend a meeting at work or a party in your personal life if you know at
                least some of the people who will be there. If you are in a social situation and do not
                want to spend time with &apos;John&apos; because you don&apos;t like him or he cannot
                help you with a particular issue, a good set of social skills will allow you to
                politely convey that you need to spend time with other people at the get together.
              </p>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-[#E2E8F0] shadow-md shadow-slate-200/50 bg-slate-50">
                <Image
                  src="https://geetauniversity.edu.in/uploads/all/514/conversions/pexels-andrea-piacquadio-3762800-full.webp"
                  alt="Greater Efficiency"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. 3-Card Outcomes Grid (Elevated Cards) ── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC]">
        <div className="gu-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="rounded-[24px] bg-white p-8 sm:p-9 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-t-4 border-t-[#23518D]">
              <div>
                <h4 className="font-serif text-[22px] font-bold text-[#23518D] mb-4">
                  Advancing Career Prospects
                </h4>
                <p className="text-[15.5px] leading-[1.8] text-[#475569] text-justify">
                  Most worthwhile jobs have a &apos;people component&apos; and the most lucrative positions
                  often involve a large amount of time spent interacting with employees, media, and
                  colleagues. It is rare that an individual can remain isolated in their office and still
                  excel in their job. Most organisations are looking for individuals with a tactical
                  skill set: the ability to work well in a team and to influence and motivate people to
                  get things done.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-[24px] bg-white p-8 sm:p-9 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-t-4 border-t-[#E8871A]">
              <div>
                <h4 className="font-serif text-[22px] font-bold text-[#23518D] mb-4">
                  Better Communication
                </h4>
                <p className="text-[15.5px] leading-[1.8] text-[#475569] text-justify">
                  Relating with people and being able to work in large groups naturally develops one&apos;s
                  communication skills. After all, you cannot have great social skills without good
                  communication skills, and being able to convey one&apos;s thoughts and ideas may be the
                  single most important skill that you can develop in life.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-[24px] bg-white p-8 sm:p-9 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-t-4 border-t-[#059669]">
              <div>
                <h4 className="font-serif text-[22px] font-bold text-[#23518D] mb-4">
                  Increased Overall Happiness
                </h4>
                <p className="text-[15.5px] leading-[1.8] text-[#475569] text-justify">
                  Getting along and understanding people will help to open many personal and
                  career-related doors. Having the confidence to start a conversation at a
                  work-related conference may lead to a new job offer with a higher salary. A smile and
                  &apos;hello&apos; in a social situation may lead to a friendship being formed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Legacy & Ecosystem Section ── */}
      <LegacyEcosystem contextText="XEDGE benefits from the integrated ecosystem of:" />
    </main>
  );
}
