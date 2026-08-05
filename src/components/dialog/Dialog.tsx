import clsx from "clsx";
import { type PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@/assets/images/close.svg?react";
import { Button } from "../button/Button";
import styles from "./Dialog.module.css";

type DialogProps = PropsWithChildren<{
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  className?: string;
  showClose?: boolean;
  closeClassName?: string;
}>;

export const Dialog = ({
  dialogRef,
  children,
  className,
  showClose,
  closeClassName,
}: DialogProps) => {
  const closeDialog = () => dialogRef.current?.close();

  useEffect(() => {
    const close = (event: MouseEvent) => {
      // Note to future me: Dialogs can have a ::backdrop pseudo-element that counts towards click
      // events so we can't do the "does the dialog contain the event target" trick here.
      if (dialogRef.current === null || !dialogRef.current.open) return;
      const dialogRect = dialogRef.current.getBoundingClientRect();

      const isClickedOutside =
        event.clientX < dialogRect.left ||
        event.clientX > dialogRect.right ||
        event.clientY < dialogRect.top ||
        event.clientY > dialogRect.bottom;

      if (isClickedOutside) {
        dialogRef.current.close();
      }
    };

    document.addEventListener("click", close, { capture: true });
    return () => document.removeEventListener("click", close, { capture: true });
  }, [dialogRef]);

  return createPortal(
    <dialog className={clsx(styles.dialog, className)} ref={dialogRef}>
      {showClose && (
        <Button className={clsx(styles.close, closeClassName)} kind="danger" onClick={closeDialog}>
          <CloseIcon title="Close" />
        </Button>
      )}
      {children}
    </dialog>,
    document.body,
  );
};
