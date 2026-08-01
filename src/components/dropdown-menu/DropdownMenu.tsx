import clsx from "clsx";
import { customAlphabet } from "nanoid";
import type { PropsWithChildren } from "react";
import { Children, useEffect, useRef } from "react";

import styles from "./DropdownMenu.module.css";

type DropdownProps = PropsWithChildren<{
  button: string;
  className?: string;
}>;

export const DropdownMenu = ({ button, children, className }: DropdownProps) => {
  const id = customAlphabet("1234567890abcdef", 10)();
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialog.current) return;

    const el = dialog.current;
    el.addEventListener("click", (e) => {
      const wasButton = !!(e.target as HTMLElement).closest("button");
      if (wasButton) el.hidePopover();
    });

    return () => el.removeEventListener("click", () => {});
  }, []);

  return (
    <>
      <button
        className={clsx(styles.button, className)}
        popoverTarget={id}
        style={{ anchorName: `--${id}` } as React.CSSProperties}
        type="button"
      >
        {button}
      </button>
      <dialog
        className={styles.menu}
        id={id}
        popover=""
        ref={dialog}
        style={{ positionAnchor: `--${id}` } as React.CSSProperties}
      >
        <menu>
          {Children.map(children, (child) => {
            return child && <li key={child.toString()}>{child}</li>;
          })}
        </menu>
      </dialog>
    </>
  );
};
