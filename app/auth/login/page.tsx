/** @format */

import { ReturnButton } from "@/components/buttons/return";
import { MagicLinkLoginForm } from "@/components/magic-link-login-form";
import { SignInOauthButton } from "@/components/buttons/sign-in-oauth";
import { LogInForm } from "@/components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Log In</h1>
      </div>

      <div className="space-y-4">
        <MagicLinkLoginForm />
        <LogInForm />

        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account? {""}
          <Link href="/auth/register" className="hover:text-foreground">
            Register
          </Link>
        </p>

        <hr className="max-w-sm" />
      </div>

      <div className="flex flex-col max-w-sm gap-4">
        <SignInOauthButton provider="google" />
        <SignInOauthButton provider="github" />
      </div>
    </div>
  );
}
