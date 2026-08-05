"use client";

import { useRef } from "react";

export const useTooltip = () => {
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const showTooltip = () => tooltipRef?.current?.showPopover();
  const hideTooltip = () => tooltipRef?.current?.hidePopover();
  const toggleTooltip = () => tooltipRef?.current?.togglePopover();

  return { tooltipRef, showTooltip, hideTooltip, toggleTooltip };
};
