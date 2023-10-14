import { LocatieToken } from "~/types/token";

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const body = await readBody(event);
  const naam = body.naam?.toString();

  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    throw createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  const barLocatie = await fetchAuthorized<LocatieToken>(session, "/api/v3/bar/trust", {
    body: JSON.stringify({ naam }),
  });

  auth.updateSessionAttributes(session.sessionId, {
    location_name: barLocatie.naam,
    location_token: barLocatie.sleutel,
  });
});
