import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Contentindex`.
 */
export type ContentindexProps = SliceComponentProps<Content.ContentindexSlice>;

/**
 * Component for "Contentindex" Slices.
 */
const Contentindex = ({ slice }: ContentindexProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for contentindex (variation: {slice.variation})
      Slices
    </section>
  );
};

export default Contentindex;
