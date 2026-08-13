import { createContext, type PropsWithChildren, useState } from "react";

const TitleContext = createContext<
  { title: string; setTitle: (title: string) => void } | undefined
>(undefined);

const TitleProvider = ({ children, value }: PropsWithChildren<{ value: string }>) => {
  const [title, setTitle] = useState(value);
  return <TitleContext value={{ title, setTitle }}>{children}</TitleContext>;
};

export { TitleContext, TitleProvider };
