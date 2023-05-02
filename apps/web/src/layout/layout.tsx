import { cn, ElementProps } from "ui";
import { Header } from "./header";

export const Layout = ({ children, className, ...rest }: ElementProps<"div">) => {
  const _className = cn("flex flex-col h-screen max-h-full w-full font-sans", className);

  return (
    <div className={_className} {...rest}>
      <Header />
      <main className="grow w-full h-full">{children}</main>
    </div>
  );
};
