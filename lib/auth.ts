/** @format */

import { hashPassword, verifyPassword } from "@/lib/argon2";
import prisma from "@/lib/prisma";
import { getValidDomains, normalizeName } from "@/lib/utils";
import { UserRole } from "@/prisma/generated/enums";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { admin, customSession, magicLink } from "better-auth/plugins";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { ac, roles } from "@/lib/permissions";
import { sendEmailAction } from "@/actions/send-email.action";

const options = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 10, // 10 minutes in seconds
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/auth/verify");

      await sendEmailAction({
        to: user.email,
        subject: "Verify Your Email Address",
        meta: {
          description:
            "Please verify your email address to complete registration.",
          link: String(link),
        },
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 10, // 10 minutes in seconds
    sendResetPassword: async ({ user, url }) => {
      const email = user.email;
      await sendEmailAction({
        to: email,
        subject: "Reset your password",
        meta: {
          description: "Please click the link below to reset your password.",
          link: String(url),
        },
      });
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1];

        const VALID_DOMAINS = getValidDomains();
        if (!VALID_DOMAINS.includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid domain. Please use a valid email.",
          });
        }

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name: normalizeName(ctx.body.name),
            },
          },
        };
      }

      if (ctx.path === "/sign-in/magic-link") {
        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name: normalizeName(ctx.body.name)
            }
          },
        };
      }

      if (ctx.path === "/update-user") {
        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name: normalizeName(ctx.body.name)
            }
          },
        };
      }
      
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];

          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: UserRole.ADMIN } };
          }

          return { data: user };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"] as Array<UserRole>,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // 10 minutes in seconds
    }
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles,
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmailAction({
          to: email,
          subject: "Magic Link Login",
          meta: {
            description: "Please click the link below to log in.",
            link: String(url),
          },
        });
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          role: user.role,
        },
      };
    }, options),
  ]
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
