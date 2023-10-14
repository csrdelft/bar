export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const body = await readBody(event);
  const id = body.id?.toString();
  const naam = body.naam?.toString();

  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    throw createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  await fetchAuthorized(session, "/api/v3/bar/updatePerson");
});
