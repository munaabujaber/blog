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
  title: "Data Controls | Blog",
  description:
    "Manage your blog account preferences and exercise privacy rights.",
};

export default function DataControlsPage() {
  return (
    <LegalPageLayout
      title="Data Controls"
      description="Use these options to manage your account and browser preferences or to ask the publisher to act on personal data associated with you."
    >
      <LegalSection title="Self-service controls">
        <div className="overflow-hidden rounded-lg border">
          <div className="grid gap-2 border-b p-4 sm:grid-cols-[1fr_1.2fr]">
            <p className="font-semibold text-foreground">Profile details</p>
            <p>
              Signed-in users can update their name, profile image, or
              password on the{" "}
              <Link
                className="font-medium text-foreground underline underline-offset-4"
                href="/profile"
              >
                profile page
              </Link>
              .
            </p>
          </div>
          <div className="grid gap-2 border-b p-4 sm:grid-cols-[1fr_1.2fr]">
            <p className="font-semibold text-foreground">Authentication</p>
            <p>
              Sign out from the site to end authenticated use. If you used
              Google or GitHub sign-in, you can also manage the connection in
              that provider&apos;s account settings.
            </p>
          </div>
          <div className="grid gap-2 border-b p-4 sm:grid-cols-[1fr_1.2fr]">
            <p className="font-semibold text-foreground">
              Theme and sidebar preferences
            </p>
            <p>
              Change theme using the theme control, or erase saved browser
              preferences through your browser&apos;s cookie and site-data
              settings.
            </p>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-[1fr_1.2fr]">
            <p className="font-semibold text-foreground">Uploaded content</p>
            <p>
              Managed uploads can be removed through the publishing tools. For
              content that identifies you and cannot be removed in your
              account, submit a request below.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="Make a privacy request">
        <p>
          To request access, a copy of your data, correction, deletion,
          restriction, or to object to processing, email{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4"
            href={`mailto:${policyContactEmail}?subject=Privacy%20request`}
          >
            {policyContactEmail}
          </a>{" "}
          with the subject &quot;Privacy request&quot;.
        </p>
        <LegalList>
          <li>Describe the right you want to exercise.</li>
          <li>
            Provide the email address used for your account, if applicable,
            and enough detail to locate the relevant information.
          </li>
          <li>
            Do not email passwords or identity documents unless specifically
            requested through a secure verification method.
          </li>
        </LegalList>
        <p>
          We may need to verify your identity before releasing or deleting
          information. Requests will be addressed within the time required by
          applicable law; GDPR-style laws generally require a response within
          one month, subject to permitted extensions for complex requests.
        </p>
      </LegalSection>

      <LegalSection title="Deletion and retention limits">
        <p>
          A valid deletion request can remove account data and content linked
          to you where applicable. Some information may need to remain when it
          is necessary for legal obligations, security, the establishment or
          defence of legal claims, or freedom of expression and information,
          such as a lawfully published post.
        </p>
        <LegalCallout>
          <p>
            The currently implemented profile screen does not include an
            automatic self-service account deletion button. Deletion requests
            must be sent by email until that functionality is added.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection title="Regional rights">
        <p>
          Rights depend on applicable law. Individuals protected by GDPR-style
          laws, including where Bosnia and Herzegovina&apos;s Personal Data
          Protection Law applies, may have rights of access, rectification,
          erasure, restriction, objection, and data portability, as applicable.
          You may lodge a complaint with the competent supervisory authority.
        </p>
        <p>
          If California privacy law applies to the publisher and to your data,
          California residents may request to know, correct, or delete covered
          information and may exercise applicable rights without
          discrimination. The site does not currently sell or share personal
          data for cross-context behavioural advertising.
        </p>
      </LegalSection>

      <LegalSection title="Related information">
        <p>
          More information about categories of processing and retention is in
          the{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href="/privacy"
          >
            Privacy Notice
          </Link>
          . Browser storage details are in the{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href="/cookies"
          >
            Cookie Notice
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
