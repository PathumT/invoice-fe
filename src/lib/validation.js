import { z } from "zod";

/** Accepts string or number from form; rejects non-numeric characters (one optional decimal point). */
function numericNonNegativeField(message = "Numbers only") {
  return z
    .union([z.string(), z.number()])
    .transform((v) => {
      if (typeof v === "number" && Number.isFinite(v)) return String(v);
      if (typeof v === "string") return v.trim();
      return "";
    })
    .refine((s) => s === "" || /^(\d+(\.\d*)?|\.\d+)$/.test(s), { message })
    .transform((s) => (s === "" ? 0 : Number(s)))
    .pipe(z.number().nonnegative().finite());
}

export const bankDetailsSchema = z.object({
  accountHolder: z.string().trim().min(1, "Required"),
  bankName: z.string().trim().min(1, "Required"),
  branch: z.string().trim().min(1, "Required"),
  accountNumber: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^\d+$/, "Account number must contain digits only"),
  swift: z
    .string()
    .trim()
    .min(8, "SWIFT is usually 8–11 characters")
    .max(11)
    .regex(/^[A-Za-z0-9]+$/, "SWIFT must be alphanumeric"),
});

export const templateFormSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  hourlyRate: numericNonNegativeField(),
  monthlyHours: numericNonNegativeField(),
  bankDetails: bankDetailsSchema,
});

export const generateInvoiceSchema = z.object({
  email: templateFormSchema.shape.email,
  hourlyRate: numericNonNegativeField().refine((v) => v > 0, "Hourly rate must be greater than 0"),
  monthlyHours: numericNonNegativeField().refine((v) => v > 0, "Monthly hours must be greater than 0"),
  bankDetails: bankDetailsSchema,
});
