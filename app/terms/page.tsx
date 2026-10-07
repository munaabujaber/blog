/** @format */

import {
  LegalList,
  LegalPageLayout,
  LegalSection,
  policyContactEmail,
} from "@/components/legal-page-layout";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Blog",
  description: "Terms governing access to and use of this technical blog.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      description="These terms govern your use of this technical blog, including its account, sign-in, profile, and authorised publishing features."
    >
      <LegalSection title="Agreement and operator">
        <p>
          By accessing this site, or by creating or using an account, you agree
          to these terms. The service is provided by the publisher identified
          as &quot;Blog&quot; in the current site configuration. The
          publisher&apos;s complete legal identity and contact information must
          be inserted before public launch.
        </p>
        <p>
          Questions about these terms can be sent to{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4"
            href={`mailto:${policyContactEmail}`}
          >
            {policyContactEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <LegalList>
          <li>
            Provide accurate account information and keep access credentials
            secure.
          </li>
          <li>
            You are responsible for activity under your account unless it
            results from a security failure attributable to the service.
          </li>
          <li>
            Google and GitHub sign-in are optional third-party services subject
            to those providers&apos; terms in addition to these terms.
          </li>
          <li>
            We may suspend access where reasonably necessary to protect the
            service, users, or comply with law.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Content and acceptable use">
        <p>
          Posts and other material published by the site are provided for
          reading and reference. Do not copy, republish, or commercially reuse
          site content except as allowed by applicable law, an applicable
          licence, or written permission from the rights holder.
        </p>
        <p>
          If your account is authorised to submit or upload content, you keep
          ownership of your content and grant the publisher a non-exclusive
          licence to host, store, reproduce, format, and display it as needed
          to operate and publish the blog. You confirm that you have rights to
          submit that content.
        </p>
        <p>You must not use the site to:</p>
        <LegalList>
          <li>
            upload unlawful, infringing, abusive, malicious, or privacy-invasive
            material;
          </li>
          <li>
            attempt unauthorised access, interfere with security, distribute
            malware, or disrupt operation of the site; or
          </li>
          <li>
            impersonate others, misrepresent affiliation, or use automated
            means in a way that unreasonably burdens the service.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Information and external links">
        <p>
          Blog articles are general technical and educational information, not
          professional, legal, security, financial, or other specialised
          advice. You are responsible for evaluating code, configurations, and
          recommendations before relying on them in your own systems.
        </p>
        <p>
          Posts may link to external websites or repositories. The publisher
          does not control their content, availability, security, or privacy
          practices.
        </p>
      </LegalSection>

      <LegalSection title="Service availability and liability">
        <p>
          The service is provided on an as-available basis. To the extent
          permitted by applicable law, the publisher does not promise that the
          site will always be uninterrupted, error-free, or suitable for a
          particular purpose, and is not liable for indirect or consequential
          losses resulting from use of the site.
        </p>
        <p>
          Nothing in these terms excludes rights or liability that cannot be
          excluded under applicable consumer protection, data protection, or
          other mandatory law.
        </p>
      </LegalSection>

      <LegalSection title="Privacy, termination, and changes">
        <p>
          Personal data is handled as described in the{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href="/privacy"
          >
            Privacy Notice
          </Link>{" "}
          and{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href="/cookies"
          >
            Cookie Notice
          </Link>
          . Account holders may use the procedures described in{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href="/data"
          >
            Data controls
          </Link>
          .
        </p>
        <p>
          You may stop using the site at any time. The publisher may revise
          these terms as the service changes; revised terms apply from the
          effective date displayed here. Governing law and any forum selection
          must be completed based on the real publisher&apos;s location before
          launch, without limiting mandatory rights available to visitors.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
