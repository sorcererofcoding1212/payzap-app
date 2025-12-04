import { prisma } from "./db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import { loginSchema } from "./schema";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { adjustAmount, generateWalletId } from "./utils";

export const AUTH_OPTIONS: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("Invalid inputs provided");
          }

          const { email, password } = credentials;

          const { success, error } = loginSchema.safeParse({ email, password });

          if (!success) {
            console.log(error);
            throw new Error("Invalid inputs provided");
          }

          const user = await prisma.user.findUnique({
            where: {
              email,
            },

            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              emailVerified: true,
            },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials provided");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid credentials provided");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
          };
        } catch (error: any) {
          if (
            error.message === "Invalid credentials provided" ||
            "Invalid inputs provided"
          ) {
            throw new Error(error.message);
          } else {
            console.log(error);
            throw new Error("Internal server error");
          }
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    session({ token, session }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as boolean;
      }

      return session;
    },

    jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.emailVerified = user.emailVerified;
      }

      return token;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const { name, email } = user;
          const { provider } = account;

          if (!name || !email) {
            return false;
          }

          const existingUser = await prisma.user.findUnique({
            where: {
              email: email,
            },

            select: {
              id: true,
              name: true,
            },
          });

          if (!existingUser) {
            const walletId = generateWalletId(email);
            const newUser = await prisma.user.create({
              data: {
                email,
                name,
                auth_type: provider === "google" ? "Google" : "Github",
                account: {
                  create: {
                    walletId,
                    balance: {
                      create: {
                        amount: adjustAmount(5000, "DATABASE"),
                        locked: 0,
                      },
                    },
                    balanceHistory: {
                      createMany: {
                        data: [
                          { balance: 0 },
                          { balance: adjustAmount(5000, "DATABASE") },
                        ],
                      },
                    },
                  },
                },
                emailVerified: true,
              },

              select: {
                id: true,
                emailVerified: true,
              },
            });

            user.id = newUser.id;
            user.emailVerified = newUser.emailVerified;
            return true;
          }

          user.id = existingUser.id;
          user.name = existingUser.name;
          return true;
        } catch (error) {
          console.log("Internal server error", error);
          return false;
        }
      }

      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
