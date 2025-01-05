import { useEffect, useState } from 'react';
import { encodeStringForId } from '../../helpers';
import type { FeedObj } from '../../types';
import DOMPurify from 'dompurify';

type FeedSourceProps = { source: FeedObj };

export const FeedSource = ({ source }: FeedSourceProps) => {
  const { rss, title, website } = source;
  const encodedId = encodeStringForId(title);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchFeedItems = async () => {
      const response = await fetch(
        `https://cors-proxy.htmldriven.com/?url=${rss}`
      );
      console.log('\n\nFeed:', title, '\nResponse:', response);
      setItems([]);
    };

    fetchFeedItems();
  }, [rss]);

  return (
    <section id={encodedId}>
      <header>
        <h3>
          <a
            href={website}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
          />
          <a href={`#${encodedId}`}>🔗</a>
        </h3>
        <p>
          <a href={rss}>(rss)</a>
        </p>
      </header>
      {items.map((item) => (
        <pre key={item}>
          <code dangerouslySetInnerHTML={{ __html: item }} />
        </pre>
      ))}
    </section>
  );
};
