import clsx from "clsx";
import { Link } from "react-router";
import type { ButtonProps } from "./Button.d";
import styles from "./Button.module.css";

export const Button = ({ kind = "primary", className, children, ...props }: ButtonProps) => {
  const { href, onClick, value, type, popoverTarget } = props;
  const classes = clsx(kind !== "inline" && styles.button, styles[kind], className);

  if (href) {
    return (
      <Link className={classes} to={href} {...props}>
        {children}
      </Link>
    );
  }

  if (onClick || value || type || popoverTarget) {
    return (
      <button className={classes} type="button" {...props}>
        {children}
      </button>
    );
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
