import Logo from "@/assets/logo.svg?react";
import { UserMenu } from "@/features/user/components/user-menu/UserMenu";
import { useTitle } from "@/hooks/useTitle";

import styles from "./AppHeader.module.css";

export const AppHeader = () => {
  const { title } = useTitle();
  return (
    <header className={styles.header}>
      <Logo title="A Worse RSS App" />
      <h1 className={styles.logo}>{title}</h1>
      <UserMenu />
    </header>
  );
};
