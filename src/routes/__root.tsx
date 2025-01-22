import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useEffect, useRef } from 'react';

import styles from './root.module.css';

import { FeedsNavigation } from '@/components/feeds-navigation/FeedsNavigation';
import { ShortcutsControl } from '@/components/shortcuts-control/ShortcutsControl';

const queryClient = new QueryClient();

const RouteComponent = () => {
    const searchParams = Route.useSearch();
    const wrapper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        wrapper.current?.scrollTo(0, 0);
    }, [searchParams]);

    return (
        <QueryClientProvider client={queryClient}>
            <header className={styles.header}>
                <h1>A Worse RSS feed reader</h1>
            </header>
            <FeedsNavigation className={styles.nav} />
            <main ref={wrapper} className={styles.main}>
                <Outlet />
            </main>
            <ShortcutsControl />
            <ReactQueryDevtools />
            <TanStackRouterDevtools />
        </QueryClientProvider>
    );
};

export const Route = createRootRoute({
    component: RouteComponent,
});
