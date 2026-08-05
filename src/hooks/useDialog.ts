import { useRef, useState } from "react";

export const useDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = async () => {
    return new Promise((resolve) => {
      if (dialogRef.current === null) {
        setIsOpen(false);
        resolve("cancel");
      } else {
        dialogRef.current.addEventListener(
          "close",
          (event: Event) => {
            setIsOpen(false);
            resolve((event.target as HTMLDialogElement).returnValue);
          },
          { once: true },
        );
        setIsOpen(true);
        dialogRef.current.showModal();
      }
    });
  };

  const closeDialog = () => {
    setIsOpen(false);
    dialogRef.current?.close();
  };

  return { dialogRef, openDialog, closeDialog, isOpen };
};
