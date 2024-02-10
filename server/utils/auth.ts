import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import { DatabaseSession, DatabaseUser, db } from "./db";
import { OAuth2Client } from "oslo/oauth2";

const adapter = new BetterSqlite3Adapter(db, {
  user: "user",
  session: "session",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (data) => {
    const scopes = JSON.parse(data.scopes) as string[];
    return {
      displayName: data.name,
      scopes,
      slug: data.slug,
      rechten: {
        admin: scopes.includes("BAR:TRUST") ?? false,
        beheer: scopes.includes("BAR:BEHEER") ?? false,
      },
    };
  },
  getSessionAttributes: (data) => {
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      locatie: data.location_token
        ? {
            naam: data.location_name,
            token: data.location_token,
          }
        : undefined,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
    DatabaseSessionAttributes: Omit<DatabaseSession, "id" | "user_id" | "expires_at">;
  }
}

const config = useRuntimeConfig();

export const oauth2Client = new OAuth2Client(
  config.public.authId,
  `${config.public.remoteUrl}/authorize`,
  `${config.public.remoteUrl}/api/v3/token`,
  {
    redirectURI: `${config.public.origin}/api/auth/callback`,
  },
);
