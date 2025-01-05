import { useSelector } from '@xstate/store/react';

import { FeedArticle } from '@/components/feed-article/FeedArticle';
import { feedStore } from '@/stores/feed.store';

export const FeedArticleList = () => {
    const articles = useSelector(feedStore, (state) => state.context.articles);

    return (
        <>
            <header>
                <h2>Feeds ({articles.length})</h2>
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

            {articles.map((article) => (
                <FeedArticle key={article.id} article={article} />
            ))}
            <p>You&rsquo;ve reached the end&hellip;</p>
            <button>Mark All Unseen</button>
        </>
    );
};
