import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { login } from "apis/auth";
import { ProfileApi } from "libs/axios";

export default NextAuth({
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  debug: process.env.NODE_ENV === "development",
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "sbe",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
        user: { label: "User", type: "text" },
      },

      async authorize(credentials, req) {
        const response = await fetch(
          "https://aviata.sportsbookengine.com/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          // Authentication successful
          return Promise.resolve(data);
        } else {
          // Authentication failed
          return Promise.reject(
            new Error(data.error || "Authentication failed")
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, session }) {
      if (user && account && account.type === "credentials") {
        console.log(account.type, "... general log ...");
        if (user) {
          const { accessToken, ...rest } = user;
          token.accessToken = accessToken;
          token.accessTokenExpiry = Date.now() + 7 * 24 * 60 * 60;
          token.user = rest;
        }
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        ...Object(token.user),
      };
      return session;
    },
    async signIn({ user, account }) {
      if (account?.type === "credentials") {
        account.access_token = user?.accessToken;
        return true;
      }
      return false;
    },
  },
});
