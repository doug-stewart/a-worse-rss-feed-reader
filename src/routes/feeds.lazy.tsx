import { createLazyFileRoute } from '@tanstack/react-router';

import { FeedsRoute } from '@/features/feeds/routes/feeds-route/FeedsRoute';

export const Route = createLazyFileRoute('/feeds')({
    component: FeedsRoute,
});
