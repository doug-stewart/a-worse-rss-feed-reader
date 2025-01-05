import type { CategoryObj, FeedObj } from '../../types';
import DOMPurify from 'dompurify';
import { FeedSource } from '../feed-source/FeedSource';
import { encodeStringForId } from '../../helpers';

type FeedCategoryProps = { category: CategoryObj; feeds: Array<FeedObj> };

export const FeedCategory = ({ category, feeds }: FeedCategoryProps) => {
  const { name, id } = category;

  const encodedId = `${encodeStringForId(name)}-${id}`;

  return (
    <section id={encodedId}>
      <h2>
        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(name) }} />
        <a href={`#${encodedId}`}>🔗</a>
      </h2>

      {feeds.map((feed) => (
        <FeedSource key={feed.title} source={feed} />
      ))}
    </section>
  );
};
