/** @format */

import {
  ArrowRight,
  BookOpenText,
  Braces,
  Github,
  Mail,
  MessageSquareText,
  PenTool,
  Send,
  Sparkles,
  TerminalSquare,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/footer";
import { NavMenu } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authSession } from "@/lib/auth-utils";

const contactEmail = "hello@example.com";

const blogTopics = [
  "Software engineering",
  "AI tooling",
  "Systems thinking",
  "Product-minded builds",
  "Debugging notes",
];

const focusAreas = [
  {
    title: "Engineering notes",
    description:
      "Clear explanations of the decisions, tradeoffs, and fixes that turn code into dependable software.",
    icon: Braces,
  },
  {
    title: "Build logs",
    description:
      "Practical write-ups from projects, experiments, and the messy middle of learning by shipping.",
    icon: Wrench,
  },
  {
    title: "Technical guides",
    description:
      "Step-by-step articles for developers who want useful context, not just copy-paste snippets.",
    icon: BookOpenText,
  },
];

const contactReasons = [
  "Questions about a post",
  "Engineering collaboration",
  "Feedback on technical topics",
  "Project or writing ideas",
];

export const metadata: Metadata = {
  title: "Contact | Technical Engineering Blog",
  description:
    "Learn more about the author behind this technical engineering blog and get in touch about software, AI, projects, and practical engineering writing.",
};

export default async function ContactPage() {
  const session = await authSession();

  return (
    <>
      <NavMenu
        userName={session?.user.name}
        userImage={session?.user.image as string}
      />

      <main>
        <section className="border-b bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-md px-3 py-1">
                  <TerminalSquare className="size-3.5" />
                  Technical engineering blog
                </Badge>
                <Badge variant="outline" className="rounded-md px-3 py-1">
                  <Sparkles className="size-3.5" />
                  Practical notes from the build
                </Badge>
              </div>

              <div className="flex flex-col gap-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Contact
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Hi, I&apos;m the engineer behind this blog.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  This is where I write about software engineering, AI,
                  debugging, architecture, and the technical decisions that make
                  projects easier to understand and maintain.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href={`mailto:${contactEmail}`}>
                    <Mail />
                    Email me
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/">
                    Read the blog
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-background p-5 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--accent-1),var(--accent-2))]" />
              <div className="flex items-center gap-2 border-b pb-4">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-amber-400" />
                <span className="size-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  contact-notes.md
                </span>
              </div>
              <div className="space-y-5 pt-5 font-mono text-sm leading-7">
                <p>
                  <span className="text-muted-foreground">const</span>{" "}
                  <span className="text-[color:var(--accent-1)]">blog</span> ={" "}
                  <span className="text-[color:var(--accent-2)]">
                    &quot;engineering in public&quot;
                  </span>
                  ;
                </p>
                <p>
                  <span className="text-muted-foreground">focus</span>: [
                  {blogTopics.slice(0, 3).map((topic, index) => (
                    <span key={topic}>
                      &quot;{topic}&quot;
                      {index < 2 ? ", " : ""}
                    </span>
                  ))}
                  ];
                </p>
                <p className="text-muted-foreground">
                  Notes are written for builders who like careful thinking,
                  useful examples, and honest lessons from real projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about-me"
          className="px-4 py-14 sm:px-6 lg:px-8"
          aria-labelledby="about-me-title"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                About me
              </p>
              <h2
                id="about-me-title"
                className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                I care about building things that are understandable, useful,
                and resilient.
              </h2>
            </div>
            <div className="grid gap-5 text-base leading-7 text-muted-foreground">
              <p>
                I use this space to document what I&apos;m learning while
                working through technical problems: how systems behave, why
                certain implementation choices matter, and what makes developer
                tools feel better in everyday use.
              </p>
              <p>
                The tone here is practical and engineering-focused. I like
                writing that helps someone leave with a clearer mental model,
                a sharper debugging path, or a better way to think about a
                build.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {blogTopics.map((topic) => (
                  <Badge key={topic} variant="outline" className="rounded-md">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/30 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                What I write about
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Technical writing for people who build.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {focusAreas.map(({ title, description, icon: Icon }) => (
                <Card key={title} className="rounded-lg">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <div className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="px-4 py-14 sm:px-6 lg:px-8"
          aria-labelledby="contact-title"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Get in touch
              </p>
              <h2
                id="contact-title"
                className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Have a question, idea, or technical topic you want to discuss?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                Send a note about engineering topics, blog feedback,
                collaboration ideas, or a project you think would make a useful
                technical write-up.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <MessageSquareText className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Best reasons to reach out</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {contactReasons.map((reason) => (
                        <Badge
                          key={reason}
                          variant="secondary"
                          className="rounded-md"
                        >
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button className="justify-start" asChild>
                    <Link href={`mailto:${contactEmail}`}>
                      <Send />
                      {contactEmail}
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="https://github.com/">
                      <Github />
                      GitHub
                    </Link>
                  </Button>
                </div>

                <div className="border-t pt-5">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <PenTool className="size-4" />
                    Browse the latest engineering posts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
