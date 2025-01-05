/*
I need routes:

/
/login
/index
/user
/add
/feeds?category=mep
/feeds?feed=mep

*/

/*
I need to add to the data:

- categories and feeds need to know about layouts
- the "all" views need to have a layout
- alls, categories and feeds need a sort order

*/

/*
I need to add basic functionality:

- refresh
- mark all read
- mark older than 1 day read
- mark older than 1 week read
- mark as read on scroll
- mark as read on open
- can sort feed views independently
- can set layouts for feed views
- can add feed
- can delete feed
- can reorder categories in sidebar

*/

import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import styles from './root.module.css';

import { FeedInitializer } from '@/components/feed-initializer/FeedInitializer';
import { FeedsNavigation } from '@/components/feeds-navigation/FeedsNavigation';

const RouteComponent = () => {
    return (
        <>
            <header className={styles.header}>
                <h1>What if your RSS feed reader was worse?</h1>
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
