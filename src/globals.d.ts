declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css?*' {
  const content: { [className: string]: string };
  export default content;
}

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
    };
    expires: string;
  }

  interface User {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    expiresIn?: number;
    requestToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    requestToken?: string;
    exp?: number;
  }
}