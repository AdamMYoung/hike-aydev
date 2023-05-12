import useBreakpoint from "use-breakpoint";

const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 };

export const useIsMobile = () => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "desktop");

  return breakpoint === "mobile";
};
