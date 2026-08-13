import { useState } from "react";
import { useForm } from "react-hook-form";
import EditIcon from "@/assets/edit.svg?react";
import type { Feed } from "@/features/feeds/types";
import { DeleteFeed } from "../delete-feed/DeleteFeed";
import styles from "./FeedItem.module.css";

type FeedInputs = {
  name: string;
  website: string;
  rss: string;
};

export const FeedItem = ({ feed }: { feed: Feed }) => {
  const favicon = `https://icon.horse/icon/${new URL(feed.website).hostname.replace("www.", "")}`;

  const [editing, setEditing] = useState(false);

  const toggleEditing = () => {
    setEditing((current) => !current);
  };

  const { register, handleSubmit } = useForm<FeedInputs>({
    defaultValues: {
      name: feed.name,
      website: feed.website,
      rss: feed.rss,
    },
  });

  const submitForm = (data: FeedInputs) => {
    console.log(data);
  };

  return (
    <li className={styles.feed}>
      {editing ? (
        <form onSubmit={handleSubmit(submitForm)}>
          <label>
            Name
            <input {...register("name")} />
          </label>
          <label>
            Website
            <input {...register("website")} />
          </label>
          <label>
            RSS
            <input {...register("rss")} />
          </label>
          <button type="submit">Save</button>
          <button type="reset">Cancel</button>
        </form>
      ) : (
        <>
          <img alt="" src={favicon} />
          <a href={feed.website}>{feed.name}</a>
          <button onClick={toggleEditing} type="button">
            <EditIcon title="Edit" />
          </button>
          <DeleteFeed feedId={feed.id} />
        </>
      )}
    </li>
  );
};
