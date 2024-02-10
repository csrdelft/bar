import { OAuth2RequestError } from "oslo/oauth2";
import { oauth2Client } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code?.toString() ?? null;

  // validate state
  if (!code) {
    throw createError({
      statusCode: 400,
    });
  }

  const config = useRuntimeConfig();

  try {
    const tokens = await oauth2Client.refreshAccessToken(code, {
      credentials: config.authSecret,
    });

    return tokens;
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
