"use client";

import React from "react";

export default function SPBLLifeGrid() {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full bg-white">
          {/* Column 1 */}
          <div className="flex flex-col">
            {/* 1. Student photo */}
            <div className="relative h-[260px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://spbsb.vercel.app/images/student.webp"
                alt="Student Classroom Learning"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 2. Light experiential learning card */}
            <div className="flex flex-col justify-center bg-white p-7 sm:p-8 h-[260px]">
              <h3 className="text-[#0e395c] font-bold text-[1.08rem] leading-[1.35] mb-2.5">
                Experiential Learning through simulations and role-plays:
              </h3>
              <p className="text-[#475569] text-[0.92rem] leading-[1.55] m-0">
                Interactive simulations and role-playing activities help students understand
                real-life scenarios, improve decision-making, and build confidence in professional
                environments.
              </p>
            </div>

            {/* 3. Research team photo */}
            <div className="relative h-[260px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://spbsb.vercel.app/images/research.webp"
                alt="Students Working on Laptop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            {/* 1. Dark blue project learning card */}
            <div className="flex flex-col justify-center bg-[#062e55] p-7 sm:p-8 h-[260px]">
              <h3 className="text-white font-bold text-[1.08rem] leading-[1.35] mb-2.5">
                Project-Based Learning with live industry projects
              </h3>
              <p className="text-white/90 text-[0.92rem] leading-[1.55] m-0">
                Students work on real-world industry problems, gaining hands-on experience and
                developing practical skills that align with current market demands.
              </p>
            </div>

            {/* 2 & 3. Courtroom photo + Beige card combo */}
            <div className="flex flex-col h-[520px]">
              <div className="h-[340px] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/uploads/all/2156/corporate.jpg"
                  alt="Case Study and Moot Court Session"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[180px] bg-[#f5e6d3] p-6 sm:p-7 flex flex-col justify-center">
                <h3 className="text-[#0e395c] font-bold text-[1.08rem] leading-[1.35] mb-2">
                  Case-Based Learning using Harvard, IIM, and Global case repositories:
                </h3>
                <p className="text-[#374151] text-[0.92rem] leading-[1.55] m-0">
                  Exposure to globally recognized case studies enables students to analyse complex
                  business situations, think critically, and apply theoretical concepts effectively.
                </p>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            {/* 1 & 2. Tall card with alumni photo and overlay text */}
            <div className="relative h-[520px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://spbsb.vercel.app/images/alumni.webp"
                alt="Students Internship Immersion"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6, 46, 85, 0.95) 0%, rgba(6, 46, 85, 0.45) 50%, rgba(0, 0, 0, 0.1) 100%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8 z-10">
                <h3 className="text-white font-bold text-[1.08rem] leading-[1.35] mb-2.5">
                  Internship-driven immersion and continuous industry engagement:
                </h3>
                <p className="text-white/90 text-[0.92rem] leading-[1.55] m-0">
                  Regular internships and industry interactions ensure students gain practical
                  exposure, build professional networks, and stay aligned with evolving industry
                  trends.
                </p>
              </div>
            </div>

            {/* 3. Campus outdoor group photo */}
            <div className="relative h-[260px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://spbsb.vercel.app/images/campusLife.webp"
                alt="Campus Life Outdoor Community"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
