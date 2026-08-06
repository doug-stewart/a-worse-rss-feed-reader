import { createContext, type RefObject } from "react";

const ScrollContext = createContext<RefObject<Element | null> | null>(null);
export default ScrollContext;
