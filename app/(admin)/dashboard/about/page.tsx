/** @format */

import { getAboutPageContent } from "@/actions/about";
import AboutForm from "@/components/about-form";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function DashboardAboutPage() {
  await requireAuth();
  const content = await getAboutPageContent();

  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Site content
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            About Page
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage the public About page text and main photo from here.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/about" target="_blank">
            View page
            <ExternalLink />
          </Link>
        </Button>
      </div>

      <AboutForm content={content} />
    </div>
  );
}
