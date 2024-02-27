"use client";

import { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";

interface Repository {
  id: number;
  name: string;
  description: string;
  language: string;
  html_url: string;
}

export default function GithubList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    setLoadingState(true);

    fetch(
      "https://api.github.com/users/wandersonce/repos?per_page=100&sort=updated",
    )
      .then((response) => response.json())
      .then((data) => setRepositories(data));

    setLoadingState(false);
  }, []);
  console.log(repositories);
  return (
    <div>
      {loadingState && (
        <div className="flex items-center justify-center">
          Loading...
          <LuLoader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
}
