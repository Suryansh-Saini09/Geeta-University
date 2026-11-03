"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseFiniteCarouselOptions {
  totalItems: number;
  autoplayInterval?: number;
  enableAutoplay?: boolean;
}

export function useFiniteCarousel({
  totalItems,
  autoplayInterval = 4000,
  enableAutoplay = true,
}: UseFiniteCarouselOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardStepRef = useRef<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Measure visible items & calculate maxIndex dynamically
  const updateLayout = useCallback(() => {
    if (!containerRef.current || totalItems === 0) return;
    const container = containerRef.current;
    const containerWidth = container.clientWidth;

    // Measure first child card width
    const track = container.firstElementChild as HTMLElement | null;
    const firstCard = (track?.firstElementChild || container.firstElementChild) as HTMLElement | null;

    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;

    // Detect gap from CSS flex/grid gap or fallback to margin
    let gap = 0;
    if (track) {
      const style = window.getComputedStyle(track);
      const gapVal = parseFloat(style.gap || style.columnGap || "0");
      if (!isNaN(gapVal) && gapVal > 0) gap = gapVal;
    }

    if (gap === 0) {
      const cardStyle = window.getComputedStyle(firstCard);
      const marginLeft = parseFloat(cardStyle.marginLeft || "0");
      const marginRight = parseFloat(cardStyle.marginRight || "0");
      gap = marginLeft + marginRight;
    }

    const cardStep = cardWidth + gap;
    cardStepRef.current = cardStep;
    const visibleCount = Math.max(1, Math.floor((containerWidth + gap) / (cardStep || 1)));
    const calculatedMaxIndex = Math.max(0, totalItems - visibleCount);

    setVisibleItems(visibleCount);
    setMaxIndex(calculatedMaxIndex);

    // Clamp current index if it exceeds maxIndex after resize
    setCurrentIndex((prev) => Math.min(prev, calculatedMaxIndex));
  }, [totalItems]);

  // Use ResizeObserver for responsive measurement
  useEffect(() => {
    updateLayout();

    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      updateLayout();
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [updateLayout]);

  // Scroll container to a target index
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      let cardStep = cardStepRef.current;

      if (cardStep <= 0) {
        const track = container.firstElementChild as HTMLElement | null;
        const firstCard = (track?.firstElementChild || container.firstElementChild) as HTMLElement | null;
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth;
        let gap = 0;
        if (track) {
          const style = window.getComputedStyle(track);
          const gapVal = parseFloat(style.gap || style.columnGap || "0");
          if (!isNaN(gapVal) && gapVal > 0) gap = gapVal;
        }
        if (gap === 0) {
          const cardStyle = window.getComputedStyle(firstCard);
          gap = parseFloat(cardStyle.marginLeft || "0") + parseFloat(cardStyle.marginRight || "0");
        }
        cardStep = cardWidth + gap;
        cardStepRef.current = cardStep;
      }

      const maxScroll = container.scrollWidth - container.clientWidth;
      const targetScroll = Math.min(index * cardStep, maxScroll);

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior,
      });
    },
    []
  );

  // Next function: 0 -> 1 -> ... -> maxIndex -> 0
  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      if (maxIndex <= 0) return 0;
      const newIndex = prev >= maxIndex ? 0 : prev + 1;
      scrollToIndex(newIndex);
      return newIndex;
    });
  }, [maxIndex, scrollToIndex]);

  // Previous function: 0 -> maxIndex, else prev - 1
  const prev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (maxIndex <= 0) return 0;
      const newIndex = prev <= 0 ? maxIndex : prev - 1;
      scrollToIndex(newIndex);
      return newIndex;
    });
  }, [maxIndex, scrollToIndex]);

  // Direct index jump
  const goTo = useCallback(
    (index: number) => {
      const clampedIndex = Math.min(Math.max(0, index), maxIndex);
      setCurrentIndex(clampedIndex);
      scrollToIndex(clampedIndex);
    },
    [maxIndex, scrollToIndex]
  );

  // Autoplay
  useEffect(() => {
    if (!enableAutoplay || isHovered || isDragging || maxIndex <= 0) return;

    const timer = setInterval(() => {
      next();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [enableAutoplay, isHovered, isDragging, maxIndex, autoplayInterval, next]);

  // Keep index synced during manual scroll or drag
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isDragging) return;
    const container = containerRef.current;
    let cardStep = cardStepRef.current;

    if (cardStep <= 0) {
      const track = container.firstElementChild as HTMLElement | null;
      const firstCard = (track?.firstElementChild || container.firstElementChild) as HTMLElement | null;
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      let gap = 0;
      if (track) {
        const style = window.getComputedStyle(track);
        const gapVal = parseFloat(style.gap || style.columnGap || "0");
        if (!isNaN(gapVal) && gapVal > 0) gap = gapVal;
      }
      cardStep = cardWidth + gap;
      cardStepRef.current = cardStep;
    }

    if (cardStep <= 0) return;

    const approxIndex = Math.round(container.scrollLeft / cardStep);
    const clamped = Math.min(Math.max(0, approxIndex), maxIndex);
    setCurrentIndex(clamped);
  }, [isDragging, maxIndex]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handleScroll();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    handleScroll();
  };

  return {
    containerRef,
    currentIndex,
    maxIndex,
    visibleItems,
    next,
    prev,
    goTo,
    handleScroll,
    handleMouseDown,
    handleMouseLeave,
    handleMouseEnter,
    handleMouseUp,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    setIsHovered,
  };
}
