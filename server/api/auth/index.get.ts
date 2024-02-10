import { generateCodeVerifier, generateState } from "oslo/oauth2";
import { oauth2Client } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier(); // for PKCE flow

  const url = await oauth2Client.createAuthorizationURL({
    state,
    scopes: ["BAR:NORMAAL", "BAR:BEHEER", "BAR:TRUST"],
    // FIXME: codeVerifier,
  });
  // url.searchParams.set("remote-login", "true"); // TODO: needed?

  setCookie(event, "csr_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60,
    sameSite: "lax",
  });
  return sendRedirect(event, url.toString());
});
