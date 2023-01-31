import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "../../../lib/auth/prisma-adapter";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Google Client ID is not defined.");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google Client Secret is not defined.");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      if (
        !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
      ) {
        return "/register/connect-calendar/?error=permissions";
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);
