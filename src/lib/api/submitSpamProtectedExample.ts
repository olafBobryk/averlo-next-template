type ExampleSuccessResponse = {
  ok: true;
  message: string;
};

type ExampleErrorResponse = {
  message?: string;
  error?: string;
  retryAfterSeconds?: number;
};

export type SpamProtectedExampleSubmission = {
  name: string;
  email: string;
  message: string;
  attachment?: File | null;
};

type ExampleApiError = Error & {
  status?: number;
  payload?: ExampleErrorResponse | null;
};

export async function submitSpamProtectedExample(
  data: SpamProtectedExampleSubmission,
): Promise<ExampleSuccessResponse> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("message", data.message);

  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }

  const response = await fetch("/api/internal/forms/spam-protected-example", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as
    | ExampleSuccessResponse
    | ExampleErrorResponse
    | null;

  if (!response.ok) {
    const errorPayload = payload as ExampleErrorResponse | null;
    const error = new Error(
      errorPayload && typeof errorPayload === "object"
        ? (errorPayload.message ??
          errorPayload.error ??
          "Submission failed.")
        : "Submission failed.",
    ) as ExampleApiError;
    error.status = response.status;
    error.payload = errorPayload;
    throw error;
  }

  return (
    (payload as ExampleSuccessResponse | null) ?? {
      ok: true,
      message: "Example form submitted.",
    }
  );
}
