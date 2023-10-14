export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const body = await readBody(event);

  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    throw createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  await fetchAuthorized<boolean>(session, "/api/v3/bar/bestelling", {
    body,
  });
});
