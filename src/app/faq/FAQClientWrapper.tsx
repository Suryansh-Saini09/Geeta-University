"use client";

import React from "react";
import FAQHero from "@/components/faq/FAQHero";
import FAQAccordionSection from "@/components/faq/FAQAccordionSection";

interface FAQClientWrapperProps {
  heroData?: any;
  categoriesData?: any;
  faqsListData?: any;
}

export default function FAQClientWrapper({
  heroData,
  categoriesData,
  faqsListData,
}: FAQClientWrapperProps) {
  return (
    <>
      <FAQHero data={heroData} />
      <FAQAccordionSection
        categoriesData={categoriesData}
        faqsListData={faqsListData}
      />
    </>
  );
}
