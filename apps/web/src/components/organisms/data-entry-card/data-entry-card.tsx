import { cn, ElementProps } from "ui";

export const DataEntryCard = ({ className, children, ...rest }: ElementProps<"div">) => {
  const _className = cn("flex flex-col gap-2 p-4 rounded-lg border bg-white", className);

  return (
    <div className={_className} {...rest}>
      {children}
    </div>
  );
};

export const DataEntryCardTitle = ({ className, children, ...rest }: ElementProps<"h2">) => {
  const _className = cn("text-lg font-medium", className);
  return (
    <h2 className={_className} {...rest}>
      {children}
    </h2>
  );
};

export const DataEntryCardDescription = ({ className, children, ...rest }: ElementProps<"p">) => {
  const _className = cn("text-sm font-light", className);

  return (
    <p className={_className} {...rest}>
      {children}
    </p>
  );
};
