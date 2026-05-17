/** @format */

import {
  BookOpen,
  BriefcaseBusiness,
  Github,
  Lightbulb,
  Mail,
  Newspaper,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

const contentLinks = [
  { href: "/", label: "Latest posts", icon: Newspaper },
  { href: "/blog/tag/tutorials", label: "Tutorials", icon: BookOpen },
  { href: "/blog/tag/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/blog/tag/insights", label: "Insights", icon: Lightbulb },
  { href: "/blog/tag/research", label: "Research", icon: ShieldCheck },
];

const accountLinks = [
  { href: "/auth/login", label: "Log in" },
  { href: "/auth/register", label: "Create account" },
  { href: "/profile", label: "Profile" },
  { href: "/dashboard", label: "Dashboard" },
];

const companyLinks = [
  { href: "/contact#about-me", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/#work-with-me", label: "Work with me" },
  { href: "/#newsletter", label: "Newsletter" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/data", label: "Data controls" },
  { href: "/cookies", label: "Cookies" },
];

export default function Footer() {
  return (
    <footer id="footer-contact" className="border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_2fr] lg:px-8">
        <div className="flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              B
            </span>
            <span className="text-lg font-semibold tracking-tight">Blog</span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Practical writing on software, AI, projects, research, and the
            lessons that come from building in public.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="mailto:hello@example.com"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <Mail className="size-4" />
              hello@example.com
            </Link>
            <Link
              href="https://github.com/"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <Github className="size-4" />
              GitHub
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Explore" links={contentLinks} />
          <FooterColumn title="Account" links={accountLinks} icon={UserRound} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Data & Legal" links={legalLinks} />
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {new Date().getFullYear()} Blog. All rights reserved.</p>
          <p>Built for writing now, ready for a company later.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  icon: TitleIcon,
}: {
  title: string;
  links: {
    href: string;
    label: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {TitleIcon && <TitleIcon className="size-4 text-muted-foreground" />}
        {title}
      </h2>
      <ul className="flex flex-col gap-2">
        {links.map(({ href, label, icon: LinkIcon }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {LinkIcon && <LinkIcon className="size-4" />}
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
