import clsx from "clsx";
import DeleteIcon from "@/assets/delete.svg?react";
import { Dialog } from "@/components/dialog/Dialog";
import { useFeeds } from "@/features/feeds/hooks/useFeeds";
import { useDialog } from "@/hooks/useDialog";

type DeleteFeedProps = { feedId: number; className?: string };

export const DeleteFeed = ({ feedId, className }: DeleteFeedProps) => {
  const { deleteFeed } = useFeeds();
  const { dialogRef, openDialog, closeDialog } = useDialog();

  const deleteFeedItem = () => {
    deleteFeed.mutateAsync(feedId).then(() => closeDialog());
  };

  return (
    <>
      <button className={clsx(className)} onClick={openDialog} type="button">
        <DeleteIcon title="Delete" />
      </button>
      <Dialog dialogRef={dialogRef}>
        You sure?
        <div>
          <button onClick={closeDialog} type="button">
            Nevermind
          </button>
          <button onClick={deleteFeedItem} type="button">
            Nuke it!
          </button>
        </div>
      </Dialog>
    </>
  );
};
