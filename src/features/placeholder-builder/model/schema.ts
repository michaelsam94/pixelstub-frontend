import { z } from "zod";

const hexPattern = /^[0-9a-fA-F]{1,2}$|^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/;

export const placeholderSchema = z.object({
  width: z.coerce.number().int().min(1).max(5000),
  height: z.coerce.number().int().min(1).max(5000),
  bgHex: z.string().regex(hexPattern, "Use 1, 2, 3, or 6 hex characters"),
  fgHex: z.string().regex(hexPattern, "Use 1, 2, 3, or 6 hex characters"),
  format: z.enum(["png", "jpg", "jpeg", "gif", "webp"]),
  text: z.string().max(200)
});

export type PlaceholderSpec = z.infer<typeof placeholderSchema>;

export const defaultSpec: PlaceholderSpec = {
  width: 1200,
  height: 630,
  bgHex: "FAFAF9",
  fgHex: "18181B",
  format: "png",
  text: "PixelStub"
};
