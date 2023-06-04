import { CookieOptions } from "nuxt/app";

export const tokenOptions = {
  sameSite: "strict",
  expires: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
} satisfies CookieOptions;

export const locatieTokenOptions = {
  sameSite: "strict",
  expires: new Date(+new Date() + 1000 * 24 * 60 * 60 * 1000),
} satisfies CookieOptions;

