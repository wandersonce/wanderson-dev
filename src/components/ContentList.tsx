"use client";

import { Content, asImageSrc, isFilled } from "@prismicio/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

type ContentListProps = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[];
  contentType: Content.ContentindexSlice["primary"]["content_type"];
  fallBackImage: Content.ContentindexSlice["primary"]["fallback_item_image"];
  viewMoreText: Content.ContentindexSlice["primary"]["view_more_text"];
};

export default function ContentList({
  items,
  contentType,
  fallBackImage,
  viewMoreText = "Check This",
}: ContentListProps) {
  const component = useRef(null);
  const revealRef = useRef(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const [currentItem, setCurrentItem] = useState<null | number>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const contentImages = items.map((item) => {
    const image = isFilled.image(item.data.hover_image)
      ? item.data.hover_image
      : fallBackImage;

    return asImageSrc(image, {
      fit: "crop",
      w: 220,
      h: 320,
      exp: -10,
    });
  });

  const onMouseEnter = (index: number) => {
    setCurrentItem(index);
  };

  const onMouseLeave = () => {
    setCurrentItem(null);
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          },
        );
      });
      return () => ctx.revert();
    }, component);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };

      //Calculate Speed and Direction
      const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2));

      let ctx = gsap.context(() => {
        if (currentItem !== null) {
          const maxY = window.scrollY + window.innerHeight - 350;
          const maxX = window.innerWidth - 250;

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1),
            ease: "back.out(2)",
            duration: 1.3,
            opacity: 1,
          });
        }
        lastMousePos.current = mousePos;
        return () => ctx.revert();
      }, component);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [currentItem]);

  useEffect(() => {
    contentImages.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [contentImages]);

  return (
    <div>
      <ul
        className="grid border-b border-b-slate-100 "
        onMouseLeave={onMouseLeave}
      >
        {items
          .sort(function (a: any, b: any) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            // @ts-ignore
            return new Date(b.data.date) - new Date(a.data.date);
          })
          .map((item, index) => (
            <>
              {isFilled.keyText(item.data.title) && (
                <li
                  key={index}
                  className="flex max-w-sm opacity-0 md:list-item md:max-w-full"
                  onMouseEnter={() => onMouseEnter(index)}
                  ref={(el) => (itemsRef.current[index] = el)}
                >
                  <Link
                    target="_blank"
                    // @ts-ignore: Unreachable code error
                    href={item.data.link_to_source.url || "/"}
                    className="flex flex-col items-start border-t border-t-slate-100 py-10 text-slate-200 md:flex-row md:justify-between"
                    aria-label={item.data.title}
                  >
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold">
                        {item.data.title}
                      </span>
                      <div className="flex flex-wrap gap-3 text-lg font-bold text-yellow-400">
                        {item.tags.map((tag, index) => (
                          <span key={index}>{tag} </span>
                        ))}
                      </div>
                    </div>
                    <span className="ml-0 flex items-start gap-2 text-xl font-medium md:ml-auto md:items-center">
                      {viewMoreText} <MdArrowOutward />
                    </span>
                  </Link>
                </li>
              )}
            </>
          ))}
      </ul>

      {/* HOVER ELEMENT */}
      <div
        className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[320px] w-[220px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
        style={{
          backgroundImage:
            currentItem !== null ? `url(${contentImages[currentItem]})` : "",
        }}
        ref={revealRef}
      ></div>
    </div>
  );
}
