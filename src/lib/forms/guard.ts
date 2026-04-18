export type HoneypotPolicy = {
  fieldName: string;
};

export type CooldownPolicy = {
  cookieName: string;
  windowSeconds: number;
};

export type FilePolicy = {
  fieldName: string;
  maxFiles: number;
  maxFileSizeBytes: number;
  maxTotalSizeBytes: number;
  allowedExtensions: readonly string[];
  allowedMimeTypes: readonly string[];
};

export type FormGuardPolicy = {
  honeypot: HoneypotPolicy;
  cooldown: CooldownPolicy;
  files?: FilePolicy;
};

export type FileValidationError =
  | "too_many_files"
  | "file_too_large"
  | "files_too_large"
  | "invalid_file_type";

type CookieReader = {
  get: (name: string) => unknown;
};

type SubmissionGuardResult =
  | { kind: "ok"; files: File[] }
  | { kind: "honeypot" }
  | { kind: "cooldown"; retryAfterSeconds: number }
  | { kind: "file_error"; error: FileValidationError };

function normalizeCookieValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "value" in value &&
    typeof (value as { value?: unknown }).value === "string"
  ) {
    return (value as { value: string }).value;
  }

  return "";
}

function getFileExtension(fileName: string) {
  const extensionIndex = fileName.lastIndexOf(".");
  if (extensionIndex < 0) return "";

  return fileName.slice(extensionIndex).toLowerCase();
}

export function isHoneypotTriggered(
  formData: FormData,
  policy: HoneypotPolicy,
) {
  const value = formData.get(policy.fieldName);
  return typeof value === "string" && value.trim().length > 0;
}

export function isCooldownActive(
  cookieStore: CookieReader,
  policy: CooldownPolicy,
) {
  return (
    normalizeCookieValue(cookieStore.get(policy.cookieName)).trim().length > 0
  );
}

export function buildCooldownCookie(policy: CooldownPolicy) {
  return {
    name: policy.cookieName,
    value: "1",
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: policy.windowSeconds,
  };
}

export function collectFiles(formData: FormData, fieldName: string) {
  return formData
    .getAll(fieldName)
    .flatMap((value) =>
      value instanceof File && value.size > 0 ? [value] : [],
    );
}

export function validateFiles(
  files: File[],
  policy: FilePolicy,
): FileValidationError | null {
  if (files.length > policy.maxFiles) {
    return "too_many_files";
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > policy.maxTotalSizeBytes) {
    return "files_too_large";
  }

  const allowedExtensions = new Set(
    policy.allowedExtensions.map((extension) => extension.toLowerCase()),
  );
  const allowedMimeTypes = new Set(
    policy.allowedMimeTypes.map((mimeType) => mimeType.toLowerCase()),
  );

  for (const file of files) {
    if (file.size > policy.maxFileSizeBytes) {
      return "file_too_large";
    }

    const extension = getFileExtension(file.name);
    if (!allowedExtensions.has(extension)) {
      return "invalid_file_type";
    }

    if (!allowedMimeTypes.has(file.type.toLowerCase())) {
      return "invalid_file_type";
    }
  }

  return null;
}

export function validateSubmissionGuards({
  formData,
  cookieStore,
  policy,
}: {
  formData: FormData;
  cookieStore: CookieReader;
  policy: FormGuardPolicy;
}): SubmissionGuardResult {
  if (isHoneypotTriggered(formData, policy.honeypot)) {
    return { kind: "honeypot" };
  }

  if (isCooldownActive(cookieStore, policy.cooldown)) {
    return {
      kind: "cooldown",
      retryAfterSeconds: policy.cooldown.windowSeconds,
    };
  }

  const files = policy.files
    ? collectFiles(formData, policy.files.fieldName)
    : [];

  if (policy.files) {
    const fileError = validateFiles(files, policy.files);
    if (fileError) {
      return { kind: "file_error", error: fileError };
    }
  }

  return { kind: "ok", files };
}
