import { compare } from "bcryptjs";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { db } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function isWaterlooEmail(email: string) {
  return email.toLowerCase().endsWith("@uwaterloo.ca");
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "UW Credentials",
      credentials: {
        email: { label: "UW Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        if (!isWaterlooEmail(email)) return null;

        const user = await db.user.findUnique({
          where: { email }
        });
        if (!user?.passwordHash) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          verificationLevel: user.verificationLevel
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.verificationLevel = (user as { verificationLevel?: string }).verificationLevel ?? "VERIFIED";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.verificationLevel = token.verificationLevel as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/sign-in"
  }
};
