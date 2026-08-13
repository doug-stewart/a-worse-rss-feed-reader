import type { PropsWithChildren } from "react";
import { Dialog } from "@/components/dialog/Dialog";

// import styles from "./ConfirmationDialog.module.css";

type ConfirmationDialogProps = PropsWithChildren & {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  cancelLabel: string;
  deleteLabel: string;
  onCancel: () => Promise<unknown>;
  onDelete: () => Promise<unknown>;
};

export const ConfirmationDialog = ({
  children,
  dialogRef,
  cancelLabel,
  deleteLabel,
  onCancel,
  onDelete,
}: ConfirmationDialogProps) => (
  <Dialog dialogRef={dialogRef} showClose={false}>
    {children}
    <div>
      <button onClick={onCancel} type="button">
        {cancelLabel}
      </button>
      <button onClick={onDelete} type="button">
        {deleteLabel}
      </button>
    </div>
  </Dialog>
);
