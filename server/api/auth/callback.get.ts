import { User, generateId } from "lucia";
import { OAuth2RequestError } from "oslo/oauth2";
import { oauth2Client } from "~/server/utils/auth";
import { DatabaseUser } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;
  const storedState = getCookie(event, "csr_oauth_state") ?? null;

  // validate state
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      statusCode: 400,
    });
  }

  const config = useRuntimeConfig();

  try {
    const tokens = await oauth2Client.validateAuthorizationCode(code, {
      credentials: config.authSecret,
      authenticateWith: "request_body",
    });

    const userResponse = await $fetch<User>(`${config.public.remoteUrl}/api/v3/profiel`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "Content-Type": "application/json",
      },
    });

    const existingUser = db.prepare("SELECT * FROM user WHERE name = ?").get(userResponse.id) as
      | DatabaseUser
      | undefined;

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
      appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
      return sendRedirect(event, "/");
    }

    const userId = generateId(15);
    db.prepare("INSERT INTO user (id, name, slug, scopes) VALUES (?, ?, ?, ?)").run(
      userId,
      userResponse.displayName,
      userResponse.slug,
      JSON.stringify(userResponse.scopes),
    );
    const session = await lucia.createSession(userId, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    return sendRedirect(event, "/");
  } catch (e) {
    console.error(e);

    if (e instanceof OAuth2RequestError) {
      const { request, message, description } = e;

      // invalid code
      throw createError({
        statusCode: 400,
        message,
      });
    }

    throw createError({
      statusCode: 500,
    });
  }
});
