import { Navigate, useLocation, useSearch } from "@tanstack/react-router";
import { type PropsWithChildren, useLayoutEffect } from "react";
import Logo from "@/assets/logo.svg?react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { scrollMainToTop } from "@/features/feeds/helpers/scrollMainToTop";
import styles from "./Layout.module.css";

export const Layout = ({ children }: PropsWithChildren) => {
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
    scrollMainToTop();
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
      <main className={styles.main}>{children}</main>
    </>
  );
};
