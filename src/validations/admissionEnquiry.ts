import { z } from "zod";

export const admissionEnquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254)
    .transform((value) => value.toLowerCase())
    .optional()
    .or(z.literal("").transform(() => undefined)),
  mobile: z.string().trim().regex(/^\d{10,15}$/, "Enter a valid mobile number (10 to 15 digits)."),
  state: z.string().trim().min(1, "State is required").max(100),
  city: z.string().trim().min(1, "City is required").max(100),
  discipline: z.string().trim().max(150).optional().or(z.literal("").transform(() => undefined)),
  course: z.string().trim().min(1, "Course or program is required").max(150),
  agree: z.boolean().default(true).optional(),
  type: z.string().trim().max(50).default("ADMISSION_ENQUIRY").optional(),
  page_url: z.string().url().max(2000).optional().or(z.literal("").transform(() => undefined)),
});

export type AdmissionEnquiryInput = z.infer<typeof admissionEnquirySchema>;
