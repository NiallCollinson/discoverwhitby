import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import Google from "next-auth/providers/google";
import { prisma } from "@discoverwhitby/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM || "Whitby Rentals <noreply@localhost>",
    }),
    Google({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error augment
        session.user.id = token.sub!;
        // @ts-expect-error augment
        session.user.role = (token as any).role ?? "customer";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error augment
        token.role = (user as any).role ?? "customer";
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export handler for Next.js route
export const authHandler = NextAuth(authOptions);


