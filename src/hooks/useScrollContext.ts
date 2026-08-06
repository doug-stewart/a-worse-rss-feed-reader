import { useContext } from "react";
import ScrollContext from "@/context/ScrollContext";

export const useScrollContext = () => {
  const ref = useContext(ScrollContext);
  return { root: ref?.current };
};
