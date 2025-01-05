// import DOMPurify from 'dompurify';
// import { useEffect, useState } from 'react';

// import { FeedArticle } from '../feed-article/FeedArticle';

// import { encodeStringForId } from '@/helpers';
// import { parseAtomFeedItem } from '@/helpers/parseFeedItem';
// import { parseRSSFeedItem } from '@/helpers/parseRSSFeedItem';
// import type { FeedArticleObj, FeedObj } from '@/types';

// type FeedSourceProps = { source: FeedObj };

// export const FeedSource = ({ source }: FeedSourceProps) => {
//     const { rss, title, website, type } = source;
//     const encodedId = encodeStringForId(title);

//     const [expanded, setExpanded] = useState(false);
//     const [pending, setPending] = useState(true);
//     const [items, setItems] = useState<Array<FeedArticleObj>>([]);

//     useEffect(() => {
//         const fetchFeedItems = async () => {
//             const rssParsedItems = [];

//             try {
//                 const rssResponse = await fetch(rss);

//                 const rssText = await rssResponse.text();
//                 const rssParser = new DOMParser();
//                 const rssDoc = rssParser.parseFromString(rssText, 'text/xml');

//                 const rssDocDate = new Date(
//                     rssDoc.getElementsByTagName('lastBuildDate')[0]?.textContent || new Date(),
//                 ).getTime();

//                 if (type === 'atom') {
//                     const rssRawItems = rssDoc.getElementsByTagName('entry');
//                     for (const rssRawItem of rssRawItems) {
//                         rssParsedItems.push(parseAtomFeedItem(rssRawItem, rssDocDate));
//                     }
//                 }

//                 if (type === 'rss') {
//                     const rssRawItems = rssDoc.getElementsByTagName('item');
//                     for (const rssRawItem of rssRawItems) {
//                         rssParsedItems.push(parseRSSFeedItem(rssRawItem, rssDocDate));
//                     }
//                 }
//             } catch (error) {
//                 console.error(`ERROR: Could not retrieve ${title}.`, error);
//             }

//             setItems(rssParsedItems);
//             setPending(false);
//         };

//         fetchFeedItems();
//     }, [rss]);

//     return (
//         <section id={encodedId}>
//             <header>
//                 <h3>
//                     <a
//                         href={website}
//                         dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
//                     />
//                     ({items.length})<a href={`#${encodedId}`}>🔗</a>
//                 </h3>
//                 {pending && <p>Loading...</p>}
//                 <p>
//                     <a href={rss}>(rss)</a>
//                 </p>
//             </header>
//             <button onClick={() => setExpanded(!expanded)}>{expanded ? 'close' : 'open'}</button>
//             <ol style={{ display: expanded ? 'block' : 'none' }}>
//                 {items.map((item) => (
//                     <li key={item.id}>
//                         <FeedArticle article={item} />
//                     </li>
//                 ))}
//             </ol>
//         </section>
//     );
// };
