/** @format */

export default function Header({ about }: { about?: string }) {
  return (
    <section id="about" className="w-full px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {about ? `${about} articles` : "Ideas, guides, and notes"}
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Latest news, tips, and insights
          <span className="block text-muted-foreground">
            {about ? `about ${about}` : "from the world of tech"}
          </span>
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Explore practical writing on software, AI, product thinking, and the
          tools shaping how modern teams build.
        </p>
      </div>
    </section>
  );
}
