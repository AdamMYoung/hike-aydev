import { Eye, EyeOff } from "lucide-react";
import { cn, ElementProps } from "ui";

type VisibilityToggleProps = Omit<ElementProps<"button">, "children"> & {
  isVisible?: boolean;
};

export const VisibilityToggle = ({ isVisible, className, ...rest }: VisibilityToggleProps) => {
  const _className = cn("rounded", !isVisible && "text-gray-400", className);

  return (
    <button className={_className} {...rest}>
      {isVisible ? <Eye /> : <EyeOff />}
    </button>
  );
};
