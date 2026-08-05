export type Category = {
  id: number;
  name: string;
  user_id: number;
};

export type Feed = {
  category: number;
  id: number;
  name: string;
  rss: string;
  type: "rss" | "atom";
  user_id: number;
  website: string;
};

export type Article = {
  id: number;
  dedup_key: string;
  title: string;
  url: string;
  cover: string | null;
  summary: string;
  body: string;
  feed_id: number;
  created_at: string;
  enriched_at: string;
  last_seen_at: string;
  published_at: string;
  updated_at: string;
  viewed: boolean;
};
