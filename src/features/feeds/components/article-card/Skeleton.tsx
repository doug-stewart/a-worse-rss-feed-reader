import type { LayoutConsts } from "@/types";
import styles from "./ArticleCard.module.css";

type SkeletonProps = {
  layout: LayoutConsts;
};

export const Skeleton = ({ layout }: SkeletonProps) => {
  return (
    <>
      <span className={styles.title} />
      <span className={styles.date} />
      <span className={styles.category} />
      {layout === "full" ? null : <span className={styles.cover} />}
      <span className={styles.summary} />
    </>
  );
};
