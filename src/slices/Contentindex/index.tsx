import Bounded from "@/components/Bounded";
import ContentList from "@/components/ContentList";
import GithubList from "@/components/GithubList";
import Heading from "@/components/Heading";
import { createClient } from "@/prismicio";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Contentindex`.
 */
export type ContentindexProps = SliceComponentProps<Content.ContentindexSlice>;

/**
 * Component for "Contentindex" Slices.
 */
const Contentindex = async ({
  slice,
}: ContentindexProps): Promise<JSX.Element> => {
  const client = createClient();
  const blogPosts = await client.getAllByType("blog_post");
  const projects = await client.getAllByType("project");

  const contentType = slice.primary.content_type || "Blog";

  const items = contentType === "Blog" ? blogPosts : projects;

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading size="xl" className="mb-8">
        {slice.primary.heading}
      </Heading>

      {isFilled.richText(slice.primary.description) && (
        <div className="prose prose-xl prose-invert mb-10">
          <PrismicRichText field={slice.primary.description} />
        </div>
      )}

      <ContentList
        items={items}
        contentType={contentType}
        viewMoreText={slice.primary.view_more_text}
        fallBackImage={slice.primary.fallback_item_image}
      />

      <Heading size="xl" className="mb-8 mt-20">
        Github Repos
      </Heading>

      <GithubList />
    </Bounded>
  );
};

export default Contentindex;
