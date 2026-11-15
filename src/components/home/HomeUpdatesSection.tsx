"use client";

import { useEffect, useRef, useState } from "react";
import {
  eventUpdates,
  placementUpdates,
  type HomeUpdate,
} from "@/data/homeUpdates";

interface UpdateColumnProps {
  title: string;
  accent: "orange" | "blue";
  updates: HomeUpdate[];
}

function UpdateColumn({
  title,
  accent,
  updates,
}: UpdateColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const scrollTopStartRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Start at middle copy so user can scroll both up and down infinitely
    const setInitialPos = () => {
      const singleHeight = el.scrollHeight / 3;
      if (singleHeight > 0 && el.scrollTop === 0) {
        el.scrollTop = singleHeight;
      }
    };

    setInitialPos();
    const timer = setTimeout(setInitialPos, 100);

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 28; // pixels per second for silky smooth continuous auto-scroll

    const step = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!isHoveredRef.current && !isDraggingRef.current && el) {
        const singleHeight = el.scrollHeight / 3;
        if (singleHeight > 0) {
          el.scrollTop += speed * delta;
          if (el.scrollTop >= 2 * singleHeight) {
            el.scrollTop -= singleHeight;
          }
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Global mousemove and mouseup listeners for smooth dragging anywhere
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      const deltaY = e.clientY - startYRef.current;
      el.scrollTop = scrollTopStartRef.current - deltaY;
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const singleHeight = el.scrollHeight / 3;
    if (singleHeight <= 0) return;

    if (el.scrollTop >= 2 * singleHeight) {
      el.scrollTop -= singleHeight;
    } else if (el.scrollTop <= 0) {
      el.scrollTop += singleHeight;
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop += e.deltaY;
    handleScroll();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isHoveredRef.current = true;
    isDraggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
    scrollTopStartRef.current = el.scrollTop;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    scrollRef.current.scrollTop = scrollTopStartRef.current - deltaY;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    isHoveredRef.current = false;
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startYRef.current = e.clientY;
    scrollTopStartRef.current = el.scrollTop;
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="updates-column overflow-hidden rounded-3xl border border-[#D9E2EC] bg-white shadow-xl"
    >
      {/* Header */}
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-6 sm:px-8">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#06355F] sm:text-3xl">
            {title}
          </h3>
        </div>
      </div>

      {/* Scrolling viewport */}
      <div className="relative h-[500px] overflow-hidden bg-white">
        {/* Top fade */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-16 bg-gradient-to-b from-white via-white/80 to-transparent" />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-20 bg-gradient-to-t from-white via-white/80 to-transparent" />

        {/* Scrollable Container with hidden scrollbar and Lenis-prevent */}
        <div
          ref={scrollRef}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onScroll={handleScroll}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          className={`h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          {/* Animated track with 3 copies for seamless bi-directional scroll */}
          <div className="updates-track pointer-events-auto">
            {/* COPY 1 */}
            <div className="updates-list">
              {updates.map((update, index) => (
                <UpdateItem
                  key={`copy1-${update.title}-${index}`}
                  update={update}
                  accent={accent}
                  isLast={index === updates.length - 1}
                />
              ))}
            </div>

            {/* COPY 2 */}
            <div className="updates-list">
              {updates.map((update, index) => (
                <UpdateItem
                  key={`copy2-${update.title}-${index}`}
                  update={update}
                  accent={accent}
                  isLast={index === updates.length - 1}
                />
              ))}
            </div>

            {/* COPY 3 */}
            <div className="updates-list">
              {updates.map((update, index) => (
                <UpdateItem
                  key={`copy3-${update.title}-${index}`}
                  update={update}
                  accent={accent}
                  isLast={index === updates.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UpdateItemProps {
  update: HomeUpdate;
  accent: "orange" | "blue";
  isLast: boolean;
}

function UpdateItem({
  update,
  accent,
  isLast,
}: UpdateItemProps) {
  return (
    <article className="group border-b border-[#E2E8F0] px-6 py-5 transition-colors duration-200 hover:bg-[#F8FAFC] sm:px-8">
      <div className="flex gap-4">
        {/* Timeline */}
        <div className="relative flex w-4 shrink-0 justify-center">
          <span
            className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
              accent === "orange"
                ? "bg-[#F28C18]"
                : "bg-[#06355F]"
            }`}
          />

          {!isLast && (
            <span className="absolute top-5 h-full w-px bg-[#D9E2EC]" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold leading-6 text-[#06355F] transition-colors duration-200 group-hover:text-[#F28C18] sm:text-base">
            {update.title}
          </h4>

          <p className="mt-1.5 text-xs leading-5 text-[#64748B] sm:text-sm">
            {update.description}
          </p>
        </div>
      </div>
    </article>
  );
}

interface HomeUpdatesSectionProps {
  data?: {
    heading?: string;
    eventUpdates?: HomeUpdate[];
    placementUpdates?: HomeUpdate[];
  } | null;
}

export default function HomeUpdatesSection({ data }: HomeUpdatesSectionProps) {
  const headingText = data?.heading || "What's Happening at GU?";
  const events = data?.eventUpdates && data.eventUpdates.length > 0 ? data.eventUpdates : eventUpdates;
  const placements = data?.placementUpdates && data.placementUpdates.length > 0 ? data.placementUpdates : placementUpdates;

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-16">
      {/* Top orange line */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-[#F28C18]" />

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#F28C18]/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#06355F]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        {/* Heading */}
        <div className="mb-12 max-w-3xl">
          <h2 className="font-serif text-4xl font-bold leading-tight text-[#06355F] sm:text-5xl">
            {headingText}
          </h2>

          <div className="mt-5 h-1 w-16 rounded-full bg-[#F28C18]" />
        </div>

        {/* Update columns */}
        <div className="grid gap-7 lg:grid-cols-2">
          <UpdateColumn
            title="Event Updates"
            accent="orange"
            updates={events}
          />

          <UpdateColumn
            title="Placement Updates"
            accent="blue"
            updates={placements}
          />
        </div>
      </div>
    </section>
  );
}