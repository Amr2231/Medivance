import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import type { ZodType, ZodTypeDef } from "zod";

/**
 * Single entry point for react-hook-form + zod across the app.
 */
export function useZodForm<TFieldValues extends FieldValues>(
  schema: ZodType<TFieldValues, ZodTypeDef, TFieldValues>,
  options?: Omit<UseFormProps<TFieldValues>, "resolver"> & {
    defaultValues?: DefaultValues<TFieldValues>;
  },
): UseFormReturn<TFieldValues> {
  return useForm<TFieldValues>({
    ...options,
    resolver: zodResolver(schema),
  });
}
