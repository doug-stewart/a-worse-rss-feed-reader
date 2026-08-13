import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import styles from "./SearchItem.module.css";

type SearchItemProps = {
  id: number;
  name: string;
  selected: boolean;
  type: "feed" | "category";
  onClick: () => void;
};

export const SearchItem = ({ id, name, selected, type, onClick }: SearchItemProps) => (
  <li>
    <Link
      className={clsx(selected && styles.selected)}
      onClick={onClick}
      search={{ [type]: [id] }}
      to={"/feeds"}
    >
      {name}
    </Link>
  </li>
);
