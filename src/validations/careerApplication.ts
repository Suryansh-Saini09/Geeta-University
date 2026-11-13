import { z } from "zod";

function isValidCalendarDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== "string") return false;

  let year: number;
  let month: number;
  let day: number;

  // Handle YYYY-MM-DD (standard HTML date input)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const parts = dateStr.split("-").map(Number);
    year = parts[0];
    month = parts[1];
    day = parts[2];
  }
  // Handle DD/MM/YYYY or DD-MM-YYYY
  else if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(dateStr)) {
    const parts = dateStr.split(/[/-]/).map(Number);
    day = parts[0];
    month = parts[1];
    year = parts[2];
  } else {
    return false;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return false;
  }

  const now = new Date();
  if (dateObj >= now) return false;

  // Applicant must be at least 18 years old
  const eighteenYearsAgo = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
  if (dateObj > eighteenYearsAgo) return false;

  return true;
}

export const careerApplicationSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(120, "Full name is too long.")
    .refine((val) => !/^\s*$/.test(val), "Full name cannot consist only of whitespace.")
    .refine((val) => /^[a-zA-Z\s.'-]+$/.test(val), "Full name contains invalid characters."),

  email_address: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254)
    .transform((val) => val.toLowerCase()),

  mobile_number: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Mobile number must contain between 10 and 15 digits."),

  date_of_birth: z
    .string()
    .trim()
    .refine(isValidCalendarDate, "Enter a valid calendar date of birth (must be at least 18 years old)."),

  marital_status: z.string().trim().max(50).optional().or(z.literal("")),
  gender: z.string().trim().max(50).optional().or(z.literal("")),
  current_city: z.string().trim().min(1, "Current city is required.").max(100),
  current_state: z.string().trim().max(100).optional().or(z.literal("")),
  home_state: z.string().trim().max(100).optional().or(z.literal("")),
  highest_qualification: z.string().trim().min(1, "Highest qualification is required.").max(150),
  linked_in_profile: z.string().trim().max(500).optional().or(z.literal("")),
  current_employer: z.string().trim().max(150).optional().or(z.literal("")),
  previous_employer: z.string().trim().max(150).optional().or(z.literal("")),
  total_experience: z.string().trim().max(100).optional().or(z.literal("")),
  designation: z.string().trim().max(100).optional().or(z.literal("")),
  key_skills: z.string().trim().max(1000).optional().or(z.literal("")),
  notice_period: z.string().trim().max(50).optional().or(z.literal("")),
  current_ctc: z.string().trim().max(50).optional().or(z.literal("")),
  expected_ctc: z.string().trim().max(50).optional().or(z.literal("")),

  job_application_for: z.string().trim().min(1, "Job category is required.").max(100),
  department: z.string().trim().min(1, "Department is required.").max(150),
  reference_source: z.string().trim().max(100).optional().or(z.literal("")),
});

export type CareerApplicationInput = z.infer<typeof careerApplicationSchema>;

