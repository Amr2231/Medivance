import type { FieldError } from "react-hook-form";

type FormFieldErrorProps = {
  error?: FieldError;
  className?: string;
};

export function FormFieldError({
  error,
  className = "text-xs text-red-500",
}: FormFieldErrorProps) {
  if (!error?.message) return null;
  return <p className={className}>{error.message}</p>;
}