export default defineEventHandler(async (event) => {
  console.log("New request: " + event.path);

  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();

  if (event.path.startsWith("/api") && !event.path.startsWith("/api/auth")) {
    if (session && session.expiresAt < Date.now()) {
      const data = await $fetch("/api/auth/refresh-token", { method: "POST" });
      auth.updateSessionAttributes(session.sessionId, {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      });
    }
  }
});
