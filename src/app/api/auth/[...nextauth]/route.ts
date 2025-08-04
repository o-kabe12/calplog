import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// authOptions を NextAuth に渡す
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };