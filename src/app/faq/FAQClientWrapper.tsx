"use client";

import React from "react";
import FAQHero from "@/components/faq/FAQHero";
import FAQAccordionSection from "@/components/faq/FAQAccordionSection";

interface FAQClientWrapperProps {
  heroData?: any;
}

export default function FAQClientWrapper({ heroData }: FAQClientWrapperProps) {
  return (
    <>
      <FAQHero data={heroData} />
      <FAQAccordionSection />
    </>
  );
}
