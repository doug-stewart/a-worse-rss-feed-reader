import { useSelector } from '@xstate/store/react';

import { FeedArticle } from '@/components/feed-article/FeedArticle';
import { feedStore } from '@/stores/feed.store';

type FeedArticleListProps = {
    filters: {
        category?: number;
        feed?: number;
        range?: string;
    };
};

export const FeedArticleList = ({ filters }: FeedArticleListProps) => {
    const articles = useSelector(feedStore, (state) => state.context.articles);
    const feeds = useSelector(feedStore, (state) => state.context.feeds);

    const filteredArticles = articles.filter((article) => {
        let include = true;

        if (filters.category) {
            const feed = feeds.find((feed) => feed.id === article.parent);
            include = feed?.category === filters.category;
        }

        if (filters.feed) {
            include = article.parent === filters.feed;
        }

        return include;
    });

    return (
        <>
            <header>
                <h2>Feeds ({filteredArticles.length})</h2>
                <menu>
                    <li>
                        <button>Change View</button>
                    </li>
                    <li>
                        <button>Mark all read</button>
                    </li>
                    <li>
                        <button>Refresh</button>
                    </li>
                </menu>
            </header>

            {filteredArticles.map((article) => (
                <FeedArticle key={article.id} article={article} />
            ))}

            <p>You&rsquo;ve reached the end&hellip;</p>
            <button>Mark All Unseen</button>
        </>
    );
};
