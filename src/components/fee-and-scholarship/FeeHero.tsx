"use client";

import React from "react";
import Image from "next/image";

interface FeeHeroProps {
  data?: {
    title?: string;
    subtitle?: string;
    bannerImage?: string;
    paragraphs?: string[];
  };
}

export default function FeeHero({ data }: FeeHeroProps) {
  const title = data?.title || "Fee Structure & Scholarships";
  const heroImage = data?.bannerImage || "/fee-and-scholarship/scholarship-hero.jpg";
  const paragraph = data?.paragraphs?.[0] || data?.subtitle || "Geeta University (GU) strongly believes that monetary constraints should not be an obstacle for a student to have access to quality education. Following scholarships are offered at GU:";

  return (
    <>
      <style>{`
        .fee-hero-container {
          position: relative;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 15px;
        }

        .fee-hero-heading {
          position: absolute;
          top: 20%;
          left: 10%;
          width: 30%;
          font-size: 42px;
          font-weight: 700;
          color: #000;
          z-index: 10;
          font-family: 'Zilla Slab', serif;
          line-height: 1.15;
        }

        .fee-hero-text {
          position: absolute;
          bottom: 36%;
          left: 10%;
          max-width: 40%;
          font-size: 18px;
          z-index: 10;
          color: #000;
          text-align: justify;
          width: 40%;
          line-height: 1.6;
        }

        @media (max-width: 1240px) {
          .fee-hero-heading {
            font-size: 34px !important;
            top: 16%;
          }
          .fee-hero-text {
            bottom: 28%;
            font-size: 16px;
          }
        }

        @media (max-width: 998px) {
          .fee-hero-heading {
            font-size: 26px !important;
            top: 12%;
            width: 35%;
          }
          .fee-hero-text {
            bottom: 18%;
            max-width: 45%;
            font-size: 14px;
            width: 45%;
            line-height: 1.4;
          }
        }

        @media (max-width: 767px) {
          .fee-hero-mobile {
            padding: 24px 16px 12px;
          }
          .fee-hero-mobile h1 {
            font-family: 'Zilla Slab', serif;
            font-size: 28px;
            font-weight: 700;
            color: #000;
            margin-bottom: 10px;
          }
          .fee-hero-mobile p {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
          }
        }
      `}</style>

      {/* Desktop / Tablet View (>= 768px) */}
      <div className="fee-hero-container position-relative hidden md:block my-4">
        <h1 className="fee-hero-heading">{title}</h1>
        <div className="relative w-full aspect-[960/540]">
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="fee-hero-text">{paragraph}</p>
      </div>

      {/* Mobile View (< 768px) */}
      <div className="block md:hidden fee-hero-mobile">
        <h1>{title}</h1>
        <p>{paragraph}</p>
        <div className="relative w-full aspect-[960/540] mt-4">
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </>
  );
}
