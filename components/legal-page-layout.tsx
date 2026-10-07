/** @format */

import Footer from "@/components/footer";
import { NavMenu } from "@/components/navbar";
import { authSession } from "@/lib/auth-utils";
import Link from "next/link";
import type { ReactNode } from "react";

const legalLinks = [
  { href: "/privacy", label: "Privacy notice" },
  { href: "/terms", label: "Terms of use" },
  { href: "/data", label: "Data controls" },
  { href: "/cookies", label: "Cookie notice" },
];

export const policyContactEmail = "hello@example.com";
export const policyEffectiveDate = "May 27, 2026";

export async function LegalPageLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const session = await authSession().catch(() => null);

  return (
    <>
      <NavMenu
        userName={session?.user.name}
        userImage={session?.user.image as string}
      />

      <main>
        <section className="border-b bg-muted/30 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Data &amp; Legal
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Effective date: {policyEffectiveDate}
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="space-y-6">
              <nav
                aria-label="Data and legal pages"
                className="rounded-lg border bg-background p-4"
              >
                <p className="mb-3 text-sm font-semibold">Data &amp; Legal</p>
                <ul className="space-y-2">
                  {legalLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        className="text-sm text-muted-foreground hover:text-foreground"
                        href={href}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                <p className="font-semibold">Before publication</p>
                <p className="mt-2">
                  Replace the placeholder operator name and{" "}
                  <span className="font-medium">{policyContactEmail}</span>{" "}
                  with the publisher&apos;s legal identity and monitored
                  privacy contact.
                </p>
              </div>
            </aside>

            <article className="min-w-0 space-y-10 text-sm leading-7 text-muted-foreground sm:text-base">
              {children}
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6">{children}</ul>;
}

export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-5 text-foreground">
      {children}
    </div>
  );
}
