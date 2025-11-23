import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models/User";
import dbConnect from "@/utils/db";
import bcrypt from "bcryptjs";
import { verifyAadhaarOtp } from "@/server/otpService";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        aadhaarNumber: { label: "Aadhaar", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        const aadhaarNumber = credentials?.aadhaarNumber;
        const otp = credentials?.otp;

        if (!email && !(aadhaarNumber && otp)) {
          return null;
        }

        try {
          await dbConnect();

          if (aadhaarNumber && otp) {
            const normalized = aadhaarNumber.replace(/\D/g, "");
            if (normalized.length !== 12 || otp.length !== 6) {
              return null;
            }

            const user = await User.findOne({ aadhaarNumber: normalized });
            if (!user) {
              return null;
            }

            const validOtp = await verifyAadhaarOtp(normalized, otp);
            if (!validOtp) {
              return null;
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }

          if (!email || !password) {
            return null;
          }

          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
