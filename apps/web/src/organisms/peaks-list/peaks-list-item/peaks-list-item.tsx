import { Checkbox, cn, ElementProps } from "ui";
import { MapPin } from "lucide-react";

export const PeaksListItem = ({ children, className, id, ...rest }: ElementProps<"div">) => {
  const _className = cn("flex items-center space-x-2 p-2", className);

  return (
    <div className="flex space-x-2 justify-between pr-4 items-center">
      <div className={_className} {...rest}>
        <Checkbox id={id} className="w-6 h-6" />
        <label htmlFor={id} className="text-md leading-none">
          {children}
        </label>
      </div>
      <button className="text-green-700/40 font-light">
        <MapPin />
      </button>
    </div>
  );
};
