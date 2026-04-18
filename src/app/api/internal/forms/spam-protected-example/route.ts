import { type NextRequest, NextResponse } from "next/server";
import {
  buildCooldownCookie,
  type FileValidationError,
  type FormGuardPolicy,
  validateSubmissionGuards,
} from "@/lib/forms/guard";

const EXAMPLE_FORM_POLICY = {
  honeypot: { fieldName: "website" },
  cooldown: {
    cookieName: "webvizion-example-form-cooldown",
    windowSeconds: 60,
  },
  files: {
    fieldName: "attachment",
    maxFiles: 3,
    maxFileSizeBytes: 5 * 1024 * 1024,
    maxTotalSizeBytes: 10 * 1024 * 1024,
    allowedExtensions: [".pdf"],
    allowedMimeTypes: ["application/pdf"],
  },
} satisfies FormGuardPolicy;

const RESPONSE_MESSAGES = {
  success:
    "Example form accepted. The cooldown cookie is now active for 60 seconds.",
  invalidName: "Please enter your name before submitting.",
  invalidEmail: "Please enter a valid email address before submitting.",
  invalidMessage: "Please enter a message before submitting.",
  cooldown: "Please wait one minute before submitting the example form again.",
  too_many_files: "Please upload no more than 3 PDF files.",
  file_too_large: "Each PDF must be 5 MB or smaller.",
  files_too_large: "Your total upload must be 10 MB or smaller.",
  invalid_file_type: "This example only accepts PDF uploads.",
} as const;

function mapFileError(error: FileValidationError) {
  switch (error) {
    case "too_many_files":
      return RESPONSE_MESSAGES.too_many_files;
    case "file_too_large":
      return RESPONSE_MESSAGES.file_too_large;
    case "files_too_large":
      return RESPONSE_MESSAGES.files_too_large;
    case "invalid_file_type":
      return RESPONSE_MESSAGES.invalid_file_type;
  }
}

function pickString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const guardResult = validateSubmissionGuards({
    formData,
    cookieStore: request.cookies,
    policy: EXAMPLE_FORM_POLICY,
  });

  if (guardResult.kind === "honeypot") {
    return NextResponse.json({ ok: true, message: "Ignored." });
  }

  if (guardResult.kind === "cooldown") {
    return NextResponse.json(
      {
        message: RESPONSE_MESSAGES.cooldown,
        retryAfterSeconds: guardResult.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(guardResult.retryAfterSeconds),
        },
      },
    );
  }

  if (guardResult.kind === "file_error") {
    return NextResponse.json(
      { message: mapFileError(guardResult.error) },
      { status: 400 },
    );
  }

  const name = pickString(formData, "name");
  const email = pickString(formData, "email");
  const message = pickString(formData, "message");

  if (!name) {
    return NextResponse.json(
      { message: RESPONSE_MESSAGES.invalidName },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: RESPONSE_MESSAGES.invalidEmail },
      { status: 400 },
    );
  }

  if (!message) {
    return NextResponse.json(
      { message: RESPONSE_MESSAGES.invalidMessage },
      { status: 400 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    message: RESPONSE_MESSAGES.success,
  });
  response.cookies.set(buildCooldownCookie(EXAMPLE_FORM_POLICY.cooldown));

  return response;
}
