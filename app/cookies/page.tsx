/** @format */

import {
  LegalCallout,
  LegalList,
  LegalPageLayout,
  LegalSection,
  policyContactEmail,
} from "@/components/legal-page-layout";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Notice | Blog",
  description:
    "Information about cookies and similar local storage used by this blog.",
};

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Notice"
      description="This page describes cookies and similar browser storage currently used to keep the blog secure and remember choices you make."
    >
      <LegalSection title="Current use">
        <p>
          This blog uses only operational authentication and interface
          preference storage in its implemented features. It does not
          currently set advertising, behavioural targeting, or analytics
          cookies.
        </p>
        <LegalCallout>
          <p>
            If optional analytics, advertising, embedded media tracking, or
            other non-essential storage is added, visitors must be given any
            consent choice required in their location before that storage is
            used.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection title="Storage details">
        <div className="overflow-hidden rounded-lg border">
          <div className="hidden grid-cols-[1fr_1.35fr_0.8fr] gap-4 border-b bg-muted/30 p-4 font-semibold text-foreground sm:grid">
            <p>Storage</p>
            <p>Purpose</p>
            <p>Duration</p>
          </div>
          <div className="grid gap-2 border-b p-4 sm:grid-cols-[1fr_1.35fr_0.8fr] sm:gap-4">
            <p className="font-semibold text-foreground">
              Authentication cookies
            </p>
            <p>
              Keep signed-in users authenticated and protect account access.
              The authentication library may also use a short-lived cached
              session cookie.
            </p>
            <p>Session duration, up to 30 days; cache up to 10 minutes.</p>
          </div>
          <div className="grid gap-2 border-b p-4 sm:grid-cols-[1fr_1.35fr_0.8fr] sm:gap-4">
            <p className="font-semibold text-foreground">
              <code>sidebar_state</code> cookie
            </p>
            <p>
              Remembers whether the dashboard sidebar is expanded or
              collapsed after a dashboard user changes it.
            </p>
            <p>7 days.</p>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-[1fr_1.35fr_0.8fr] sm:gap-4">
            <p className="font-semibold text-foreground">
              Theme browser storage
            </p>
            <p>
              Remembers a visitor&apos;s light or dark appearance preference
              after the theme setting is changed.
            </p>
            <p>Until cleared or changed in the browser.</p>
          </div>
        </div>
        <p>
          Cookie names generated for authentication can differ by deployment
          and security configuration. Authentication is necessary to deliver
          requested account features. Sidebar and theme storage implement the
          display choice requested by the user.
        </p>
      </LegalSection>

      <LegalSection title="Third-party services">
        <p>
          If you select Google or GitHub sign-in, your browser is directed to
          that provider and it may use its own cookies under its own notice.
          UploadThing processes files when an upload is made through the
          site&apos;s publishing features. These services are not used here to
          place advertising cookies on ordinary blog visits.
        </p>
      </LegalSection>

      <LegalSection title="Your controls">
        <LegalList>
          <li>
            You can remove or block cookies and local storage through browser
            settings. Blocking authentication cookies prevents account sign-in
            from working.
          </li>
          <li>
            Signing out ends your active authenticated use; browser settings
            can be used to clear remaining stored preferences.
          </li>
          <li>
            You can change the remembered appearance choice using the theme
            toggle on the site.
          </li>
        </LegalList>
        <p>
          For privacy questions about browser storage, contact{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4"
            href={`mailto:${policyContactEmail}`}
          >
            {policyContactEmail}
          </a>
          , or see the{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href="/data"
          >
            Data controls
          </Link>{" "}
          page.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
