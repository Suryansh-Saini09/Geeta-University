/**
 * Pure Mathematical Scholarship & Academic Fee Calculator Engine
 * Client-safe and server-safe utility.
 *
 * Rules:
 * 1. University awards scholarships strictly against the Tuition Fee component.
 * 2. Development Fee and additional charges are non-discountable.
 * 3. Scholarship Amount = Tuition Fee × Scholarship Percentage / 100
 * 4. Payable Semester Fee = Total Programme Fee − Scholarship Amount
 */

export interface CalculationInput {
  totalFee: number;
  tuitionFee: number;
  percentage: number;
  scholarshipAllowed?: boolean;
}

export interface CalculationResult {
  totalFee: number;
  tuitionFee: number;
  developmentFee: number;
  scholarshipPercentage: number;
  scholarshipAmount: number;
  payableFee: number;
  isEligible: boolean;
  notes?: string;
}

export function calculateScholarshipEligibility(input: CalculationInput): CalculationResult {
  const { totalFee, tuitionFee, percentage, scholarshipAllowed = true } = input;
  const developmentFee = Math.max(0, totalFee - tuitionFee);

  if (!scholarshipAllowed || percentage <= 0) {
    return {
      totalFee,
      tuitionFee,
      developmentFee,
      scholarshipPercentage: 0,
      scholarshipAmount: 0,
      payableFee: totalFee,
      isEligible: false,
      notes: !scholarshipAllowed ? "Scholarship is not permitted for this program." : undefined,
    };
  }

  // Validate percentage bounds [0 - 100]
  const clampedPercent = Math.min(100, Math.max(0, percentage));

  // Calculate scholarship strictly on tuition fee
  const scholarshipAmount = Math.round((tuitionFee * clampedPercent) / 100);

  // Maximum scholarship cannot exceed tuition fee
  const effectiveScholarship = Math.min(tuitionFee, scholarshipAmount);

  // Payable semester fee: Total Programme Fee - Scholarship Amount
  const payableFee = Math.max(0, totalFee - effectiveScholarship);

  return {
    totalFee,
    tuitionFee,
    developmentFee,
    scholarshipPercentage: clampedPercent,
    scholarshipAmount: effectiveScholarship,
    payableFee,
    isEligible: true,
  };
}
