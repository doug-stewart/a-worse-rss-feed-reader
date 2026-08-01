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
  parent: number;
  title: string;
  url: string;
  id: string;
  date: number;
  cover: string | null;
  summary: string | null;
  viewed: boolean;
  body: string;
  raw: string;
};
