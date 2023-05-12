import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import StravaProvider from "next-auth/providers/strava";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "database";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID ?? "",
      clientSecret: process.env.STRAVA_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "activity:read_all",
        },
      },
      token: {
        async request({ client, params, checks, provider }) {
          const { token_type, expires_at, refresh_token, access_token } = await client.oauthCallback(
            provider.callbackUrl,
            params,
            checks
          );
          return {
            tokens: { token_type, expires_at, refresh_token, access_token },
          };
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async session({ user, session }) {
      if (user && session.user) {
        //@ts-ignore
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = (user as any).image;
      }

      return session;
    },
  },
};
