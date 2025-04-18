/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: "administrator" | "management" | "employee";
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "administrator" | "management" | "employee";
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    id: string;
    email: string;
    name: string;
    role: "administrator" | "management" | "employee";
  }
}
