import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { getClientIp } from "@/server/auth/clientIp";
import { checkRateLimit } from "@/server/auth/rateLimiter";
import { careerApplicationSchema } from "@/validations/careerApplication";
import { serverLogger } from "@/lib/security/logger";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ success: false, message: "Expected JSON form data." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > 50_000) {
    return NextResponse.json({ success: false, message: "Application data is too large." }, { status: 413 });
  }

  const clientIp = getClientIp(request.headers);
  const ipAddress = clientIp !== "unknown-ip" ? clientIp : null;

  // Rate limit: 10 applications per hour per IP
  const rateLimit = checkRateLimit(`careers_ip_${clientIp}`, 10, 3600);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many submissions from your network. Please try again in ${Math.ceil(rateLimit.resetSeconds / 60)} minutes.`,
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

  const parsed = careerApplicationSchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Please check all required career form fields.";
    return NextResponse.json(
      {
        success: false,
        message: errorMsg,
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const userAgent = request.headers.get("user-agent") || null;

  try {
    const submission = await prisma.contactSubmission.create({
      data: {
        type: "CAREER_APPLICATION",
        name: data.full_name,
        email: data.email_address,
        phone: data.mobile_number,
        subject: `Job Application: ${data.job_application_for} - ${data.department}`,
        payload: {
          date_of_birth: data.date_of_birth,
          marital_status: data.marital_status || null,
          gender: data.gender || null,
          current_city: data.current_city,
          current_state: data.current_state || null,
          home_state: data.home_state || null,
          highest_qualification: data.highest_qualification,
          linked_in_profile: data.linked_in_profile || null,
          current_employer: data.current_employer || null,
          previous_employer: data.previous_employer || null,
          experience_type: data.total_experience || null,
          designation: data.designation || null,
          key_skills: data.key_skills || null,
          notice_period: data.notice_period || null,
          current_ctc: data.current_ctc || null,
          expected_ctc: data.expected_ctc || null,
          job_application_for: data.job_application_for,
          department: data.department,
          reference_source: data.reference_source || null,
        },
        sourcePath: "/careers",
        ipAddress,
        userAgent,
      },
      select: { id: true },
    });

    serverLogger.info("Career application created successfully", {
      module: "CAREERS",
      action: "APPLICATION_SUBMITTED",
      submissionId: submission.id,
      name: data.full_name,
      department: data.department,
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. Our HR team will get in touch with you.",
      id: submission.id,
    });
  } catch (error: unknown) {
    serverLogger.error("Failed to persist career application", {
      module: "CAREERS",
      action: "APPLICATION_ERROR",
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { success: false, message: "We encountered a temporary issue registering your application. Please try again." },
      { status: 500 }
    );
  }
}
