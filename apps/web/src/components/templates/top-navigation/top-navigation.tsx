import { Profile } from "@templates/profile";
import { ElementProps, cn } from "ui";

export const TopNavigation = ({ className, ...rest }: Omit<ElementProps<"div">, "children">) => {
  const _className = cn("w-full justify-between shadow flex p-4 items-center border-b", className);

  return (
    <div className={_className} {...rest}>
      <span className="text-3xl w-full">
        <span className="font-semibold">Hike</span>
        <span className="font-light">.aydev</span>
      </span>

      {/* @ts-expect-error Server Component */}
      <Profile />
    </div>
  );
};
