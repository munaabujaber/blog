/** @format */

import {
  ArrowRight,
  Github,
  Mail,
  MessageSquareText,
  PenTool,
  Send,
  TerminalSquare,
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

const contactReasons = [
  "Questions about a post",
  "Engineering collaboration",
  "Feedback on technical topics",
  "Project or writing ideas",
];

export const metadata: Metadata = {
  title: "Contact | Technical Engineering Blog",
  description:
    "Get in touch about software engineering, AI, projects, and practical technical writing.",
};

export default async function ContactPage() {
  const session = await authSession().catch(() => null);

  return (
    <>
      <NavMenu
        userName={session?.user.name}
        userImage={session?.user.image as string}
      />

      <main>
        <section className="border-b bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-md px-3 py-1">
                  <TerminalSquare className="size-3.5" />
                  Contact
                </Badge>
                <Badge variant="outline" className="rounded-md px-3 py-1">
                  <MessageSquareText className="size-3.5" />
                  Technical conversations welcome
                </Badge>
              </div>

              <div className="flex flex-col gap-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Get in touch
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Have a technical question, idea, or collaboration in mind?
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Send a note about engineering topics, blog feedback,
                  collaboration ideas, or a project you think would make a
                  useful technical write-up.
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
                  <Link href="/about">
                    Read about the blog
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="rounded-lg">
              <CardContent className="flex flex-col gap-6 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <MessageSquareText className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Best reasons to reach out</h2>
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
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
