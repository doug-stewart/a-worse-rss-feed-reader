import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { useId } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import styles from "./UserMenu.module.css";

export const UserMenu = ({ className }: { className?: string }) => {
  const id = useId();

  const { isAuthenticated, isLoaded, login, logout } = useAuth();

  return isLoaded ? (
    <div className={clsx(styles.wrapper, className)}>
      <button
        className={styles.toggle}
        popoverTarget={id}
        popoverTargetAction="toggle"
        title="Open user menu"
        type="button"
      >
        <span className={styles.lines}>
          <span />
          <span />
          <span />
        </span>
      </button>
      <dialog className={styles.menu} id={id} popover="auto">
        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link to="/settings">Settings</Link>
              <button className={styles.btn} onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : (
            <button className={styles.btn} onClick={login} type="button">
              Login
            </button>
          )}
        </div>
      </dialog>
    </div>
  ) : null;
};
