import * as feedsData from './assets/feedsData.json';
import { FeedCategory } from './components/feed-category/FeedCategory';
import type { FeedsDataObj } from './types';

const articleSortRegx = /^([T|t]he |[A|a] |[A|a]n )/;

function App() {
  const { categoryOrder, categories, feeds } = feedsData as FeedsDataObj;

  const orderedCategories = categories.sort((catA, catB) => {
    const indexA = categoryOrder.indexOf(catA.id);
    const indexB = categoryOrder.indexOf(catB.id);
    return indexA - indexB;
  });

  const sortedFeeds = feeds.sort((feedA, feedB) => {
    const titleA = feedA.title.replace(articleSortRegx, '');
    const titleB = feedB.title.replace(articleSortRegx, '');
    return titleA.localeCompare(titleB, 'en', { sensitivity: 'base' });
  });

  return (
    <>
      <h1>Feeds</h1>
      {orderedCategories.map((category) => (
        <FeedCategory
        key={`${category.name}-${category.id}`}
          category={category}
          feeds={sortedFeeds.filter((feed) => feed.category === category.id)}
        />
      ))}
    </>
  );
}

export default App;
