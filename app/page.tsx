/** @format */

import { GetStartedButton } from "@/components/buttons/get-started";
import { getPosts } from "@/actions/blog";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { NavMenu } from "@/components/navbar";
import Pagination from "@/components/pagination";
import PostTimeline from "@/components/post-timeline";
import { authSession } from "@/lib/auth-utils";
import FileUploader from "@/components/file-uploader";
import MediaUploader from "@/components/media-uploader";

const LANDING_POSTS_PER_PAGE = 20;
const TIMELINE_COLUMN_VERTICAL_GAP_RATIO = 1 / 5;
const TIMELINE_DESKTOP_WIDTH = "70rem";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { posts, totalPages, currentPage } = await getPosts(
    page,
    LANDING_POSTS_PER_PAGE,
  );
  const session = await authSession();
  return (
    <>
      <div className="relative w-full">
        <NavMenu
          userName={session?.user.name}
          userImage={session?.user.image as string}
        />
      </div>
      <Header />
      <div className="flex flex-col gap-6 justify-center">
        <PostTimeline
          posts={posts}
          columnVerticalGapRatio={TIMELINE_COLUMN_VERTICAL_GAP_RATIO}
          desktopTimelineWidth={TIMELINE_DESKTOP_WIDTH}
        />
        {posts.length > 0 && (
          <Pagination
            page={page}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
