import { Navigate, useLocation, useSearch } from "@tanstack/react-router";
import { type PropsWithChildren, useLayoutEffect, useRef } from "react";
import Logo from "@/assets/logo.svg?react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import styles from "./Layout.module.css";

export const Layout = ({ children }: PropsWithChildren) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const { isLoaded, isAuthenticated } = useAuth();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const { category, feed } = useSearch({
    strict: false,
    select: (search) => ({ category: search.category, feed: search.feed }),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intended behavior
  useLayoutEffect(() => {
    wrapper.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [category, feed]);

  const shouldRedirect = !isAuthenticated && isLoaded && pathname !== "/";

  return shouldRedirect ? (
    <Navigate to="/" />
  ) : (
    <>
      <header className={styles.header}>
        <h1>
          <Logo title="A Worse RSS App" />
        </h1>
      </header>
      <main className={styles.main} ref={wrapper}>
        {children}
      </main>
    </>
  );
};
