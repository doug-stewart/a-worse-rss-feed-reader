import clsx from "clsx";
import { useId } from "react";
import HamburgerMenu from "@/assets/hamburger.svg?react";
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
        type="button"
      >
        <HamburgerMenu role="presentation" />
      </button>
      <dialog className={styles.menu} id={id} popover="auto">
        {isAuthenticated ? (
          <button className={styles.btn} onClick={logout} type="button">
            Logout
          </button>
        ) : (
          <button className={styles.btn} onClick={login} type="button">
            Login
          </button>
        )}
      </dialog>
    </div>
  ) : null;
};
