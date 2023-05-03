import { ElementProps, cn } from "ui";

export const TopNavigation = ({ className, ...rest }: Omit<ElementProps<"div">, "children">) => {
  const _className = cn("w-full flex px-8 py-4 items-center border-b", className);

  return (
    <div className={_className} {...rest}>
      <span className="text-3xl w-full">
        <span className="font-semibold">Hike</span>
        <span className="font-light">.aydev</span>
      </span>
    </div>
  );
};
