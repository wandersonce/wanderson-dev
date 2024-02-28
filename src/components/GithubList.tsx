"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { LuLoader2 } from "react-icons/lu";
import { MdArrowOutward } from "react-icons/md";

interface Repository {
  id: number;
  name: string;
  description: string;
  language: string;
  html_url: string;
}

gsap.registerPlugin(ScrollTrigger);

export default function GithubList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loadingState, setLoadingState] = useState(false);

  const component = useRef(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    setLoadingState(true);
    //Fetch data from Github
    const fetchData = async () => {
      fetch(
        "https://api.github.com/users/wandersonce/repos?per_page=100&sort=updated",
      )
        .then((response) => response.json())
        .then((data) => setRepositories(data));
    };
    fetchData();

    setLoadingState(false);
  }, []);

  useEffect(() => {
    console.log(repositories);
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
  }, [repositories]);

  return (
    <div>
      {loadingState && (
        <div className="flex items-center justify-center">
          Loading...
          <LuLoader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      <ul className="grid border-b border-b-slate-100 ">
        {repositories.map((item, index) => (
          <>
            <li
              key={index}
              className="flex max-w-sm opacity-0 md:list-item md:max-w-full"
              ref={(el) => (itemsRef.current[index] = el)}
            >
              <Link
                target="_blank"
                href={item.html_url || "/"}
                className="flex flex-col items-start border-t border-t-slate-100 py-10 text-slate-200 md:flex-row md:justify-between"
                aria-label={item.name}
              >
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{item.name}</span>
                  <div className="flex flex-wrap gap-3 text-lg font-bold text-yellow-400">
                    <span>{item.language} </span>
                  </div>
                </div>
                <span className="ml-0 flex items-start gap-2 text-xl font-medium md:ml-auto md:items-center">
                  Check Repo <MdArrowOutward />
                </span>
              </Link>
            </li>
          </>
        ))}
      </ul>
    </div>
  );
}
