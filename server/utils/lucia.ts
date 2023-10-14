import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import { h3 } from "lucia/middleware";
import "lucia/polyfill/node";

import sqlite from "better-sqlite3";
import fs from "fs";

const db = sqlite(":memory:");
db.exec(fs.readFileSync("schema.sql", "utf8"));

export const auth = lucia({
  adapter: betterSqlite3(db, {
    user: "user",
    session: "user_session",
    key: "user_key",
  }),
  middleware: h3(),
  env: process.dev ? "DEV" : "PROD",
  getUserAttributes: (data) => {
    const scopes = JSON.parse(data.scopes) as string[];
    return {
      name: data.name,
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
      expiresAt: Date.now() + data.expires_in * 1000,
      locatie: data.location_token
        ? {
            naam: data.location_name,
            token: data.location_token,
          }
        : undefined,
    };
  },
});

export type Auth = typeof auth;
