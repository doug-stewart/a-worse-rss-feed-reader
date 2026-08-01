import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, useSearch } from "@tanstack/react-router";
import { useLayoutEffect, useRef } from "react";

import styles from "./IndexRoute.module.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

export const IndexRoute = () => {
  const wrapper = useRef<HTMLDivElement>(null);
  const { category, feed } = useSearch({
    strict: false,
    select: (search) => ({ category: search.category, feed: search.feed }),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intended behavior
  useLayoutEffect(() => {
    wrapper.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Snaps immediately without lag
    });
  }, [category, feed]);

  return (
    <QueryClientProvider client={queryClient}>
      <header className={styles.header}>
        <h1>A Worse RSS App</h1>
      </header>

      <main className={styles.main} ref={wrapper}>
        <Outlet />
      </main>
    </QueryClientProvider>
  );
};
