import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../prisma/client";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: "7051258296-2lh31fenvdmuc1686bag9k3uqmo1jqjq.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
}

export default NextAuth(authOptions);