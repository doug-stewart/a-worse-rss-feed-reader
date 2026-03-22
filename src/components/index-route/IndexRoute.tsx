import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, useSearch } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

import styles from './IndexRoute.module.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        },
    },
});

export const IndexRoute = () => {
    const searchParams = useSearch({ from: '/' });
    const wrapper = useRef<HTMLDivElement>(null);

    useEffect(() => window.scrollTo(0, 0), [searchParams]);

    return (
        <QueryClientProvider client={queryClient}>
            <header className={styles.header}>
                <h1>A Worse RSS feed reader</h1>
            </header>
            <main ref={wrapper} className={styles.main}>
                <Outlet />
            </main>
        </QueryClientProvider>
    );
};
