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
  title: "Privacy Notice | Blog",
  description:
    "How this blog collects, uses, shares, and protects personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Notice"
      description="This notice explains what personal data this technical blog processes when you read posts, create an account, sign in, upload content, or get in touch."
    >
      <LegalSection title="Who is responsible">
        <p>
          The publisher of Blog is the controller of personal data processed
          through this site. Privacy requests can be sent to{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4"
            href={`mailto:${policyContactEmail}`}
          >
            {policyContactEmail}
          </a>
          .
        </p>
        <LegalCallout>
          <p>
            This website is still configured with the placeholder name
            &quot;Blog&quot; and placeholder email{" "}
            <span className="font-medium">{policyContactEmail}</span>. A
            complete privacy notice must identify the real publisher and a
            working contact address before the site is made public.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection title="Data we collect">
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-foreground">
              Reading and using the site
            </h3>
            <p>
              The site counts a view when a post is opened. Like most hosted
              websites, technical request information such as IP address, user
              agent, request time, and error/security logs may also be
              processed by the hosting infrastructure needed to deliver and
              protect the service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Accounts and authentication
            </h3>
            <p>
              If you register or sign in, we process your name, email address,
              verification status, password hash or chosen social-login
              account reference, profile image, role, saved posts, verification
              or password-reset tokens, and session information including
              session token, expiration, IP address, and user agent.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Content and uploads
            </h3>
            <p>
              When publishing features are used, we process posts, categories,
              media or document uploads, filenames, file type, file size,
              storage URL, and associated publishing metadata.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Communications</h3>
            <p>
              If you email the publisher, we receive your email address and
              the information in your message. The site also sends account
              verification and password-reset emails when you request those
              account functions.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection title="Sources and information you must provide">
        <p>
          We collect information directly from you when you register, update a
          profile, upload content, or send an email; from your browser or
          device when you use the site; and from Google or GitHub if you choose
          a social sign-in option.
        </p>
        <p>
          You do not need to provide account information simply to read public
          content. To create and use an account, you must supply the account
          details required by the registration or selected sign-in flow. If you
          do not provide them, we cannot create or authenticate the account.
        </p>
      </LegalSection>

      <LegalSection title="Why we use data">
        <div className="overflow-hidden rounded-lg border">
          <div className="grid gap-2 border-b bg-muted/30 p-4 font-semibold text-foreground sm:grid-cols-[1.15fr_1fr]">
            <p>Purpose</p>
            <p>Legal basis where applicable</p>
          </div>
          <div className="grid gap-2 border-b p-4 sm:grid-cols-[1.15fr_1fr]">
            <p>Provide accounts, sign-in, profile features, and saved posts.</p>
            <p>Performance of the service you request.</p>
          </div>
          <div className="grid gap-2 border-b p-4 sm:grid-cols-[1.15fr_1fr]">
            <p>
              Verify accounts, reset passwords, prevent misuse, and secure
              sessions.
            </p>
            <p>Legitimate interests in service security and reliability.</p>
          </div>
          <div className="grid gap-2 border-b p-4 sm:grid-cols-[1.15fr_1fr]">
            <p>
              Publish authorised posts and files, and keep aggregate post view
              counts.
            </p>
            <p>
              Performance of requested publishing features and legitimate
              interests in operating the blog.
            </p>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-[1.15fr_1fr]">
            <p>Respond to questions and privacy requests.</p>
            <p>
              Legitimate interests in responding, and compliance with legal
              obligations for rights requests.
            </p>
          </div>
        </div>
        <p>
          The implemented site does not configure targeted advertising,
          advertising pixels, or analytics cookies, and it does not sell
          personal data. If that changes, this notice and any required consent
          choices must be updated before the new processing begins.
        </p>
      </LegalSection>

      <LegalSection title="Who receives data">
        <LegalList>
          <li>
            Infrastructure and database providers engaged to host and operate
            the deployed website.
          </li>
          <li>
            UploadThing, when permitted users upload images, video, or
            documents for the site.
          </li>
          <li>
            The configured email delivery provider for verification,
            password-reset, and publisher communications.
          </li>
          <li>
            Google or GitHub when you choose the corresponding social sign-in
            option; their own privacy notices also apply to their services.
          </li>
          <li>
            Regulators, courts, or authorities when disclosure is legally
            required or needed to protect the service and its users.
          </li>
        </LegalList>
        <p>
          Some service providers may process information in another country.
          Where transfer rules apply, the publisher must use an appropriate
          transfer mechanism and provider safeguards.
        </p>
      </LegalSection>

      <LegalSection title="How long data is kept">
        <LegalList>
          <li>
            Account and profile information remains while the account is
            active, then is deleted or retained only where necessary for legal,
            security, or dispute purposes.
          </li>
          <li>
            Authentication sessions are configured to expire after up to 30
            days. Short-lived verification and password-reset links expire
            after 10 minutes.
          </li>
          <li>
            Published content and associated uploads remain available until
            removed through the site&apos;s publishing tools or following a
            valid request, subject to freedom-of-expression and legal-retention
            needs.
          </li>
          <li>
            Messages and technical security logs are kept only as reasonably
            needed to answer correspondence, maintain security, or meet legal
            requirements.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Your choices and rights">
        <p>
          Depending on where you live and which laws apply, you may request
          access, correction, deletion, restriction of processing, data
          portability, or object to certain processing. You may withdraw
          consent where processing relies on consent, without affecting prior
          lawful processing.
        </p>
        <p>
          California residents may also have rights to know, correct, or
          delete covered personal information and to receive equal service for
          making a request where California law applies. Because the site does
          not sell or share personal data for cross-context behavioural
          advertising, there is currently no sale or sharing to opt out of.
        </p>
        <p>
          Visit{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href="/data"
          >
            Data controls
          </Link>{" "}
          for request instructions and practical account controls. You may
          also complain to your local data protection authority. If the
          publisher is established in Bosnia and Herzegovina, this includes
          the Agency for Personal Data Protection in Bosnia and Herzegovina.
        </p>
      </LegalSection>

      <LegalSection title="Children and automated decisions">
        <p>
          This technical blog is not directed to children under 13, and the
          publisher does not knowingly collect personal information from a
          child under 13 through the service. A parent or guardian who believes
          a child has provided information may contact the publisher to request
          review and deletion.
        </p>
        <p>
          The implemented site does not make decisions about visitors based
          solely on automated processing that produce legal or similarly
          significant effects.
        </p>
      </LegalSection>

      <LegalSection title="Cookies and updates">
        <p>
          The site uses limited authentication and preference storage
          described in the{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href="/cookies"
          >
            Cookie Notice
          </Link>
          . We may update this notice when site features, providers, or legal
          duties change. Any new effective date will be displayed on this
          page.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
