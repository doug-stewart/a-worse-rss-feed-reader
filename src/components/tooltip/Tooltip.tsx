import clsx from "clsx";
import styles from "./Tooltip.module.css";

type TooltipProps = {
  children: React.ReactNode;
  id: string;
  ref: React.Ref<HTMLSpanElement>;
  align?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export const Tooltip = ({ children, id, ref, align, className }: TooltipProps) => {
  return (
    <span
      className={clsx(styles.tootlip, styles[align ?? "top"], className)}
      id={id}
      popover="hint"
      ref={ref}
      role="tooltip"
    >
      {children}
      <span className={styles.arrow} />
    </span>
  );
};
