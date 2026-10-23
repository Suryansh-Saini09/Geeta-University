import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { checkRateLimit } from "@/server/auth/rateLimiter";
import { admissionEnquirySchema } from "@/validations/admissionEnquiry";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ success: false, message: "Expected JSON form data." }, { status: 415 });
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > 10_000) {
    return NextResponse.json({ success: false, message: "Enquiry is too large." }, { status: 413 });
  }

  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  // Rate limit: 10 submissions per hour per IP
  const clientIp = ipAddress || "unknown-ip";
  const rateLimit = checkRateLimit(`enquiry_ip_${clientIp}`, 10, 3600);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many enquiry submissions from your network. Please try again in ${Math.ceil(rateLimit.resetSeconds / 60)} minutes.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.resetSeconds),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON form data." }, { status: 400 });
  }
  const parsed = admissionEnquirySchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Please check all required enquiry fields.";
    return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
  }

  const { page_url, type = "ADMISSION_ENQUIRY", ...fields } = parsed.data;
  let sourcePath: string | null = null;
  if (page_url) {
    try {
      const url = new URL(page_url);
      sourcePath = url.pathname;
    } catch {
      sourcePath = String(page_url).slice(0, 500);
    }
  }

  const userAgent = request.headers.get("user-agent") || null;

  try {
    const submission = await prisma.contactSubmission.create({
      data: {
        type: type || "ADMISSION_ENQUIRY",
        name: fields.name,
        email: fields.email || null,
        phone: fields.mobile,
        subject: fields.course || fields.discipline || "Admission Enquiry",
        payload: {
          state: fields.state,
          city: fields.city,
          discipline: fields.discipline || null,
          course: fields.course,
          consent: fields.agree ?? true,
        },
        sourcePath,
        ipAddress,
        userAgent,
      },
      select: { id: true },
    });

    // Forward lead to Meritto / Geeta Lead API relay from server
    if (env.GEETA_LEAD_API_URL && env.GEETA_LEAD_API_KEY) {
      try {
        const leadPayload = new URLSearchParams({
          api_key: env.GEETA_LEAD_API_KEY,
          name: fields.name,
          mobile_number: fields.mobile,
          state: fields.state,
          city: fields.city,
          program: fields.course || fields.discipline || "Admission Enquiry",
        });

        // Fire-and-forget relay forwarding with timeout to avoid slowing down user response
        fetch(env.GEETA_LEAD_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: leadPayload,
          signal: AbortSignal.timeout(5000),
        }).catch((err) => {
          console.error("[Meritto Relay Error]: Failed to push lead to CRM relay:", err);
        });
      } catch (relayErr) {
        console.error("[Meritto Relay Exception]:", relayErr);
      }
    }

    return NextResponse.json(
      { success: true, leadId: submission.id, message: "Your enquiry has been received." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save admission enquiry:", error);
    return NextResponse.json(
      { success: false, message: "We could not submit your enquiry. Please try again." },
      { status: 500 }
    );
  }
}
