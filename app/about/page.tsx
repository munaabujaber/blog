/** @format */

import { getAboutPageContent } from "@/actions/about";
import Footer from "@/components/footer";
import { NavMenu } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { authSession } from "@/lib/auth-utils";
import { BookOpenText, Braces, Lightbulb, PenTool, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

const focusAreas = [
  {
    title: "Engineering clarity",
    description:
      "Notes on architecture, debugging, implementation tradeoffs, and the small details that make software easier to reason about.",
    icon: Braces,
  },
  {
    title: "Practical building",
    description:
      "Project write-ups that stay close to real decisions, useful patterns, and lessons from shipping work.",
    icon: Wrench,
  },
  {
    title: "Technical learning",
    description:
      "Guides and reflections for developers who want stronger mental models, not just quick answers.",
    icon: BookOpenText,
  },
];

export const metadata: Metadata = {
  title: "About | Technical Engineering Blog",
  description:
    "About the technical engineering blog, its author, and the software, AI, debugging, and architecture topics covered here.",
};

function getParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function AboutPage() {
  const [session, content] = await Promise.all([
    authSession().catch(() => null),
    getAboutPageContent(),
  ]);
  const paragraphs = getParagraphs(content.generalText);

  return (
    <>
      <NavMenu
        userName={session?.user.name}
        userImage={session?.user.image as string}
      />

      <main id="about">
        <section className="border-b bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="order-2 flex flex-col gap-6 lg:order-1">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-md px-3 py-1">
                  <PenTool className="size-3.5" />
                  About
                </Badge>
                <Badge variant="outline" className="rounded-md px-3 py-1">
                  <Lightbulb className="size-3.5" />
                  Technical engineering blog
                </Badge>
              </div>

              <div className="flex flex-col gap-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  About
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  About this technical engineering blog.
                </h1>
                <div className="grid max-w-2xl gap-4 text-base leading-7 text-muted-foreground sm:text-lg">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              {content.mainPhotoUrl ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border bg-muted shadow-sm">
                  <Image
                    src={content.mainPhotoUrl}
                    alt="About page main photo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 48vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-lg border bg-background p-8 shadow-sm">
                  <div className="max-w-sm text-center">
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-md bg-primary font-mono text-xl font-semibold text-primary-foreground">
                      B
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Add a main photo from the admin panel to make this page
                      feel more personal.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                The blog
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Practical writing for people who build.
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
      </main>

      <Footer />
    </>
  );
}
