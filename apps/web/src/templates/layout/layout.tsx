import { cn, ElementProps } from "ui";
import { SideNavigation } from "./side-navigation";
import { TopNavigation } from "./top-navigation";

export const Layout = ({ children, className, ...rest }: ElementProps<"div">) => {
  const _className = cn("font-sans flex flex-col h-full", className);

  return (
    <div className={_className}>
      <TopNavigation />
      <div className="grid grid-cols-[400px_1fr] shrink grow" {...rest}>
        <div className="relative w-full">
          <div className="absolute top-0 bottom-0 left-0 right-0">
            <SideNavigation />
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};
