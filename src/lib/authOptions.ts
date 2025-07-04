import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  // セッションのコールバックを追加して、Firebase Admin SDK が必要とするメールアドレスをトークンに含める
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) { // ここで型を明示する
      if (session.user) {
        session.user.email = token.email || session.user.email;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) { // ここはuserオブジェクトにemailがあれば、token.emailを設定する
      if (user) {
        token.email = user.email; // userオブジェクトのemailをtokenに設定
      }
      return token;
    },
  },
};