import { cn, ElementProps } from "ui";
import { SideNavigation } from "./side-navigation";
import { TopNavigation } from "./top-navigation";

export const Layout = ({ children, className, ...rest }: ElementProps<"div">) => {
  const _className = cn("flex flex-col h-screen font-sans", className);

  return (
    <div className={_className}>
      <TopNavigation />
      <div className="flex w-full h-full" {...rest}>
        <SideNavigation />
        <main className="grow w-full h-full">{children}</main>
      </div>
    </div>
  );
};
