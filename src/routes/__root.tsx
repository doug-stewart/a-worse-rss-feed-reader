import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import styles from './root.module.css';

import { FeedInitializer } from '@/components/feed-initializer/FeedInitializer';
import { FeedsNavigation } from '@/components/feeds-navigation/FeedsNavigation';

const RouteComponent = () => {
    return (
        <>
            <header className={styles.header}>
                <h1>A Worse RSS feed reader</h1>
            </header>
            <FeedsNavigation className={styles.nav} />
            <main className={styles.main}>
                <Outlet />
            </main>
            <FeedInitializer />
            <TanStackRouterDevtools />
        </>
    );
};

export const Route = createRootRoute({
    component: RouteComponent,
});
