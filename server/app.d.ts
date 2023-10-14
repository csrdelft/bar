/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./utils/lucia").Auth;
  type DatabaseUserAttributes = {
    name: string;
    scopes: string;
    slug: string;
  };
  type DatabaseSessionAttributes = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    location_name?: string;
    location_token?: string;
  };
}
