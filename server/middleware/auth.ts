import { verifyRequestOrigin, type Session, type User } from "lucia";

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== "GET") {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return event.node.res.writeHead(403).end();
    }
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  }
  if (!session) {
    appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }

  // TODO:
  // if (event.path.startsWith("/api") && !event.path.startsWith("/api/auth")) {
  //   if (session && session.expiresAt < Date.now()) {
  //     const data = await $fetch("/api/auth/refresh-token", { method: "POST" });
  //     auth.updateSessionAttributes(session.sessionId, {
  //       access_token: data.access_token,
  //       refresh_token: data.refresh_token,
  //       expires_in: data.expires_in,
  //     });
  //   }
  // }

  event.context.session = session;
  event.context.user = user;
});

declare module "h3" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
