import { Checkbox, cn, ElementProps } from "ui";
import { MapPin } from "lucide-react";

export const PeaksListItem = ({ children, className, id, ...rest }: ElementProps<"div">) => {
  const _className = cn("flex items-center space-x-2 p-1", className);

  return (
    <div className="flex space-x-2 justify-between pr-4 items-center group">
      <div className={_className} {...rest}>
        <Checkbox id={id} className="w-6 h-6 group-hover:bg-green-50 transition-colors" />
        <label htmlFor={id} className="text-md leading-none">
          {children}
        </label>
      </div>
    </div>
  );
};
