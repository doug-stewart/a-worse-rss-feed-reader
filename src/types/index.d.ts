export type CategoryObj = { id: number; name: string };

export type FeedObj = {
  category: number;
  title: string;
  rss: string;
  website: string;
};

export type FeedsDataObj = {
  categoryOrder: Array<number>;
  categories: Array<CategoryObj>;
  feeds: Array<FeedObj>;
};
