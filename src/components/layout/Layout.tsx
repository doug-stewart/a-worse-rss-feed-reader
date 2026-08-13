import { Navigate, useLocation, useSearch } from "@tanstack/react-router";
import { type PropsWithChildren, useLayoutEffect, useRef } from "react";
import ScrollContext from "@/context/ScrollContext";
import { TitleProvider } from "@/context/TitleContext";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { scrollMainToTop } from "@/features/feeds/helpers/scrollMainToTop";
import { AppHeader } from "../app-heaer/AppHeader";
import styles from "./Layout.module.css";

export const Layout = ({ children }: PropsWithChildren) => {
  const mainRef = useRef(null);
  const { isLoaded, isAuthenticated } = useAuth();

  const pathname = useLocation({ select: (location) => location.pathname });
  const { category, feed } = useSearch({
    strict: false,
    select: (search) => ({ category: search.category, feed: search.feed }),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intended behavior
  useLayoutEffect(() => scrollMainToTop(), [category, feed]);
  const shouldRedirect = !isAuthenticated && isLoaded && pathname !== "/";

  return (
    <TitleProvider value="A Worse RSS App">
      {shouldRedirect ? (
        <Navigate to="/" />
      ) : (
        <ScrollContext value={mainRef}>
          <AppHeader />
          <main className={styles.main} ref={mainRef}>
            {children}
          </main>
        </ScrollContext>
      )}
    </TitleProvider>
  );
};
