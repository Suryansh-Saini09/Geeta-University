"use client";

import React from "react";
import UnifiedScholarshipCalculator, {
  ScholarshipCalculatorProps,
} from "@/components/scholarship-predictor/ScholarshipCalculator";

export default function ScholarshipCalculator(props: ScholarshipCalculatorProps) {
  return (
    <UnifiedScholarshipCalculator
      {...props}
      variant={props.variant || "card"}
      lockedLevel={props.lockedLevel || "UG"}
      mode={props.mode || "standard"}
    />
  );
}
