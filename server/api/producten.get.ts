import { Product } from "~/types/product";

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);

  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    throw createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  return await fetchAuthorized<Product[]>(session, "/api/v3/bar/producten");
});
