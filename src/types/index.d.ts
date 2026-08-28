export type InlineSVG = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
  }
>;
