/** @format */

"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "@/app/globals.css";

export const GetStartedButton = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Button size="lg" className="opacity-50">
        Get Started
      </Button>
    );
  }

  const href = session ? "/profile" : "auth/login";

  return (
    <div className="flex flex-col items-center gap-4">
      <Button size="lg" asChild>
        <Link href={href}>Get Started</Link>
      </Button>

      {session && (
        <p className="flex items-center gap-2">
          <span
            data-role={session.user.role}
            className="size-4 rounded-full animate-pulse data-[role=USER]:bg-(--role-user-color) data-[role=ADMIN]:bg-(--role-admin-color)"
          />
          Welcome back, {session.user.name}!
        </p>
      )}
    </div>
  );
};
