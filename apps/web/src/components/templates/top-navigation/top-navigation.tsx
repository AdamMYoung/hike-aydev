import { Avatar, AvatarFallback, AvatarImage, ElementProps, cn } from "ui";

export const TopNavigation = ({ className, ...rest }: Omit<ElementProps<"div">, "children">) => {
  const _className = cn("w-full justify-between shadow flex p-4 items-center border-b", className);

  return (
    <div className={_className} {...rest}>
      <span className="text-3xl w-full">
        <span className="font-semibold">Hike</span>
        <span className="font-light">.aydev</span>
      </span>

      <Avatar>
        <AvatarImage src="https://github.com/adammyoung.png" alt="@adammyoung" />
        <AvatarFallback>AY</AvatarFallback>
      </Avatar>
    </div>
  );
};
