/** @format */

import { ReturnButton } from "@/components/buttons/return";
import { SignInOauthButton } from "@/components/buttons/sign-in-oauth";
import { RegisterForm } from "@/components/register-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Register</h1>
      </div>

      <div className="space-y-4">
        <RegisterForm />

        <p className="text-muted-foreground text-sm">
          Already have an account? {""}
          <Link href="/auth/login" className="hover:text-foreground">
            Log in
          </Link>
        </p>

        <hr className="max-w-sm" />
      </div>

      <div className="flex flex-col max-w-sm gap-4">
        <SignInOauthButton signUp provider="google" />
        <SignInOauthButton signUp provider="github" />
      </div>
    </div>
  );
}
