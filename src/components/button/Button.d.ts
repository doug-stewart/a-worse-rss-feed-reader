import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  PropsWithChildren,
} from "react";

type CommonBase = PropsWithChildren<{
  kind?: "primary" | "secondary" | "tertiary" | "danger" | "inline";
  className?: string;
}>;

type LinkProps = CommonBase &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "type" | "href"> & {
    href: string;
    onClick?: never;
    type?: never;
    value?: never;
    popoverTarget?: never;
    popoverTargetAction?: never;
  };

type ButtonElementProps = CommonBase &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
    download?: never;
    popoverTarget?: string;
    popoverTargetAction?: "toggle" | "open" | "close";
  };

type SpanProps = CommonBase &
  Omit<HTMLAttributes<HTMLSpanElement>, "onClick"> & {
    href?: never;
    download?: never;
    onClick?: never;
    type?: never;
    value?: never;
    popoverTarget?: never;
    popoverTargetAction?: never;
  };

export type ButtonProps = LinkProps | ButtonElementProps | SpanProps;
