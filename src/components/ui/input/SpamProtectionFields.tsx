"use client";

export function SpamProtectionFields({
  fieldName = "website",
}: {
  fieldName?: string;
}) {
  return (
    <input
      type="text"
      name={fieldName}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] h-0 overflow-hidden opacity-0"
    />
  );
}
