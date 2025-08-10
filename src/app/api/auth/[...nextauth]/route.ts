import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    EmailProvider({
      from: "noreply@example.com",
      // Для разработки: письма не отправляются, ссылка будет в консоли
      async sendVerificationRequest(params) {
        const { url, identifier } = params;
        console.log(`\n[DEV] Magic link for ${identifier}: ${url}\n`);
      },
    }),
    ...(process.env.NODE_ENV !== "production"
      ? [
          Credentials({
            id: "dev-guest",
            name: "Guest (DEV)",
            credentials: {},
            async authorize() {
              // Создаем/находим гостевого пользователя
              const email = "guest@example.com";
              const user = await prisma.user.upsert({
                where: { email },
                update: {},
                create: { email, name: "Гость" },
              });
              return { id: user.id, email: user.email ?? undefined, name: user.name ?? undefined };
            },
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


