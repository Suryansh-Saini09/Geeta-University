"use client";

import { useState } from "react";
import Image from "next/image";

interface WhyJoinGeetaSectionProps {
  data?: {
    heading?: string;
    items?: Array<{ id: number; title: string; description: string }>;
    image?: string;
  } | null;
}
export default function WhyJoinGeetaSection({ data }: WhyJoinGeetaSectionProps) {
  const [activeItem, setActiveItem] = useState<number>(0);
  const headingText = data?.heading || "Why Join Geeta University?";
  const itemList = data?.items && data.items.length > 0 ? data.items : [];
  const imageSrc = data?.image || "/home/Picture122244-(1).png";

  const handleToggle = (id: number) => {
    setActiveItem((current) => (current === id ? 0 : id));
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-16">
      {/* Decorative background element */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#F28C18]/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#06355F]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-bold leading-tight text-[#06355F] sm:text-5xl">
            {headingText}
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#F28C18]" />
        </div>

        {/* Main content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Accordion */}
          <div className="order-2 lg:order-1">
            <div className="space-y-3">
              {itemList.map((item) => {
                const isActive = activeItem === item.id;

                return (
                  <div
                    key={item.id}
                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? "border-[#F28C18] bg-[#F8FAFC] shadow-lg"
                        : "border-[#DCE5EC] bg-white hover:border-[#9EB2C4] hover:shadow-md"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id)}
                      aria-expanded={isActive}
                      aria-controls={`why-join-panel-${item.id}`}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left sm:px-6"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <span
                          className="flex h-2 w-2 rounded-full shrink-0 transition-transform duration-200"
                          style={{
                            backgroundColor: "#F28C18",
                          }}
                        />
                        {/* Title */}
                        <span
                          className={`text-sm font-bold transition-colors sm:text-base ${
                            isActive
                              ? "text-[#06355F]"
                              : "text-[#253B50]"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      {/* Arrow */}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isActive
                            ? "rotate-180 border-[#F28C18] bg-[#F28C18] text-white"
                            : "border-[#D5E0E8] bg-white text-[#06355F]"
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-4 w-4"
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    {/* Accordion content */}
                    <div
                      id={`why-join-panel-${item.id}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                        isActive
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="border-t border-[#E5EBF0] px-5 pb-5 pt-4 sm:px-6">
                          <p className="text-sm leading-6 text-[#5D6F80] sm:text-base">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative w-full max-w-lg">
              {/* Outer decorative ring */}
              <div
                aria-hidden="true"
                className="absolute -inset-5 rounded-full border border-[#F28C18]/20"
              />

              <div
                aria-hidden="true"
                className="absolute -inset-10 rounded-full border border-[#06355F]/10"
              />

              {/* Orange accent */}
              <div
                aria-hidden="true"
                className="absolute -right-2 top-8 z-10 h-20 w-20 rounded-full bg-[#F28C18] opacity-90"
              />

              {/* Image container */}
              <div className="relative aspect-square overflow-hidden rounded-full border-8 border-white bg-[#F1F5F8] shadow-2xl">
                <Image
                  src={imageSrc}
                  alt="Student representing the Geeta University experience"
                  fill
                  sizes="(max-width: 1024px) 80vw, 500px"
                  unoptimized={Boolean(imageSrc?.startsWith("/uploads/") || imageSrc?.startsWith("http"))}
                  className="object-cover"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}