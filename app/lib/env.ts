import { z } from "zod";

const envSchema = z.object({
  VELODRUH_API_BASE_URL: z
    .string()
    .min(1, "VELODRUH_API_BASE_URL is required (set it in .env)")
    .url("VELODRUH_API_BASE_URL must be a valid URL"),
});

function loadEnv() {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    const issues = result.error.issues.map(
      (i) => `  - ${i.path.join(".")}: ${i.message}`,
    );
    throw new Error(
      `Invalid frontend environment variables:\n${issues.join("\n")}`,
    );
  }
  return result.data;
}

export const env = loadEnv();
